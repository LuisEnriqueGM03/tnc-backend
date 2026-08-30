import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpsertUserDto } from '../dto/upsert-user.dto';

export interface UpdateDiscordTokensDto {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface GuildRoleData {
  id: string;
  name: string;
  color: number;
  position: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async upsert(dto: UpsertUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { discordId: dto.discordId },
    });

    const data = {
      discordId: dto.discordId,
      username: dto.username,
      globalName: dto.globalName ?? null,
      avatarUrl: dto.avatarUrl ?? null,
      joinedAt: dto.joinedAt
        ? new Date(dto.joinedAt)
        : (existing?.joinedAt ?? null),
      lastSeenAt: new Date(),
    };

    if (existing) {
      Object.assign(existing, data);
      return this.userRepository.save(existing);
    }

    return this.userRepository.save(this.userRepository.create(data));
  }

  async upsertMany(dtos: UpsertUserDto[]): Promise<void> {
    for (const dto of dtos) {
      await this.upsert(dto);
    }
  }

  async findByDiscordId(discordId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { discordId } });
    if (!user) {
      throw new NotFoundException(`Usuario ${discordId} no encontrado`);
    }
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario ${id} no encontrado`);
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ order: { lastSeenAt: 'DESC' } });
  }

  async updateDiscordTokens(
    user: User,
    tokens: UpdateDiscordTokensDto,
  ): Promise<User> {
    user.discordAccessToken = tokens.accessToken;
    user.discordRefreshToken = tokens.refreshToken;
    user.discordTokenExpiresAt = tokens.expiresAt;
    return this.userRepository.save(user);
  }

  async updateGuildRoles(user: User, roles: GuildRoleData[]): Promise<User> {
    user.guildRoles = roles;
    return this.userRepository.save(user);
  }
}
