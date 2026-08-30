import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/services/users.service';

interface DiscordTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

export interface DiscordUserResponse {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
}

export interface DiscordRoleResponse {
  id: string;
  name: string;
  color: number;
  position: number;
}

export interface DiscordGuildMemberResponse {
  roles: string[];
}

export interface AuthResult {
  token: string;
  user: User;
}

@Injectable()
export class AuthService {
  private readonly states = new Map<string, number>();

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  get frontendUrl(): string {
    return (
      this.configService.get<string>('frontendUrl') ?? 'http://localhost:5173'
    );
  }

  getAuthorizeUrl(): string {
    const state = randomUUID();
    this.states.set(state, Date.now() + 10 * 60 * 1000);

    const params = new URLSearchParams({
      client_id: this.configService.getOrThrow<string>('discord.clientId'),
      redirect_uri: this.configService.getOrThrow<string>(
        'discord.redirectUri',
      ),
      response_type: 'code',
      scope: 'identify guilds guilds.members.read',
      state,
    });

    return `https://discord.com/oauth2/authorize?${params.toString()}`;
  }

  private validateState(state: string): void {
    const expiry = this.states.get(state);

    if (!expiry || expiry < Date.now()) {
      throw new UnauthorizedException('State inválido o expirado');
    }

    this.states.delete(state);
  }

  async login(code: string, state: string): Promise<AuthResult> {
    this.validateState(state);

    const tokens = await this.exchangeCode(code);
    const discordUser = await this.getDiscordUser(tokens.access_token);

    const user = await this.usersService.upsert({
      discordId: discordUser.id,
      username: discordUser.username,
      globalName: discordUser.global_name ?? undefined,
      avatarUrl: this.buildAvatarUrl(discordUser.id, discordUser.avatar),
    });

    await this.usersService.updateDiscordTokens(user, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    });

    const token = await this.signJwt(user);
    return { token, user };
  }

  async exchangeCode(code: string): Promise<DiscordTokenResponse> {
    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.configService.getOrThrow<string>('discord.clientId'),
        client_secret: this.configService.getOrThrow<string>(
          'discord.clientSecret',
        ),
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.configService.getOrThrow<string>(
          'discord.redirectUri',
        ),
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new UnauthorizedException(
        'No se pudo intercambiar el código de Discord',
      );
    }

    return (await response.json()) as DiscordTokenResponse;
  }

  async getDiscordUser(accessToken: string): Promise<DiscordUserResponse> {
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new UnauthorizedException(
        'No se pudo obtener el usuario de Discord',
      );
    }

    return (await response.json()) as DiscordUserResponse;
  }

  async refreshDiscordToken(user: User): Promise<void> {
    if (!user.discordRefreshToken) {
      throw new UnauthorizedException('Sin refresh token de Discord');
    }

    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.configService.getOrThrow<string>('discord.clientId'),
        client_secret: this.configService.getOrThrow<string>(
          'discord.clientSecret',
        ),
        grant_type: 'refresh_token',
        refresh_token: user.discordRefreshToken,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new UnauthorizedException(
        'No se pudo refrescar el token de Discord',
      );
    }

    const tokens = (await response.json()) as DiscordTokenResponse;

    await this.usersService.updateDiscordTokens(user, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    });
  }

  async getDiscordUserWithRefresh(user: User): Promise<DiscordUserResponse> {
    if (!user.discordAccessToken) {
      throw new UnauthorizedException('El usuario no tiene sesión de Discord');
    }

    if (
      !user.discordTokenExpiresAt ||
      user.discordTokenExpiresAt.getTime() < Date.now()
    ) {
      await this.refreshDiscordToken(user);
      const refreshed = await this.usersService.findById(user.id);
      return this.getDiscordUser(refreshed.discordAccessToken ?? '');
    }

    return this.getDiscordUser(user.discordAccessToken);
  }

  async getGuildRolesForUser(user: User): Promise<DiscordRoleResponse[]> {
    if (!user.discordAccessToken) {
      throw new UnauthorizedException('El usuario no tiene sesión de Discord');
    }

    if (
      !user.discordTokenExpiresAt ||
      user.discordTokenExpiresAt.getTime() < Date.now()
    ) {
      await this.refreshDiscordToken(user);
      const refreshed = await this.usersService.findById(user.id);
      user = refreshed;
    }

    const guildId = this.configService.getOrThrow<string>('discord.guildId');
    const accessToken = user.discordAccessToken ?? '';

    const [memberRes, rolesRes] = await Promise.all([
      fetch(
        `https://discord.com/api/guilds/${guildId}/members/${user.discordId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: AbortSignal.timeout(10_000),
        },
      ),
      fetch(`https://discord.com/api/guilds/${guildId}/roles`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        signal: AbortSignal.timeout(10_000),
      }),
    ]);

    if (!memberRes.ok || !rolesRes.ok) {
      throw new UnauthorizedException(
        'No se pudieron obtener los roles de Discord',
      );
    }

    const member = (await memberRes.json()) as DiscordGuildMemberResponse;
    const roles = (await rolesRes.json()) as DiscordRoleResponse[];

    const roleMap = new Map(roles.map((role) => [role.id, role]));
    const userRoles = member.roles
      .map((roleId) => roleMap.get(roleId))
      .filter((role): role is DiscordRoleResponse => role !== undefined)
      .sort((a, b) => b.position - a.position);

    await this.usersService.updateGuildRoles(
      user,
      userRoles.map(({ id, name, color, position }) => ({
        id,
        name,
        color,
        position,
      })),
    );

    return userRoles;
  }

  buildAvatarUrl(
    discordId: string,
    avatarHash: string | null,
  ): string | undefined {
    if (!avatarHash) return undefined;
    return `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.png`;
  }

  async signJwt(user: User): Promise<string> {
    return this.jwtService.signAsync({
      sub: user.id,
      discordId: user.discordId,
    });
  }

  sanitizeUser(
    user: User,
  ): Omit<
    User,
    'discordAccessToken' | 'discordRefreshToken' | 'discordTokenExpiresAt'
  > {
    const {
      discordAccessToken,
      discordRefreshToken,
      discordTokenExpiresAt,
      ...sanitized
    } = user;
    return sanitized;
  }
}
