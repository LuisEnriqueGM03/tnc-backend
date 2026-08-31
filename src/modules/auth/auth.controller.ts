import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  AuthService,
  type DiscordUserResponse,
  type DiscordRoleResponse,
} from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '../users/entities/user.entity';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('discord/login')
  discordLogin(@Res() res: Response): void {
    const url = this.authService.getAuthorizeUrl();
    res.redirect(302, url);
  }

  @Get('discord/callback')
  async discordCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Res() res: Response,
  ): Promise<void> {
    if (error) {
      res.redirect(
        302,
        `${this.authService.frontendUrl}/api/auth/callback?error=denied`,
      );
      return;
    }

    try {
      const { token } = await this.authService.login(code, state);
      res.redirect(
        302,
        `${this.authService.frontendUrl}/api/auth/callback?token=${token}`,
      );
    } catch (err) {
      console.error('Error en discordCallback:', err);
      const errorCode =
        err instanceof UnauthorizedException && err.message?.includes('State')
          ? 'state'
          : 'generic';
      res.redirect(
        302,
        `${this.authService.frontendUrl}/api/auth/callback?error=${errorCode}`,
      );
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: RequestWithUser): Record<string, unknown> {
    return this.authService.sanitizeUser(req.user);
  }

  @Get('discord/me')
  @UseGuards(JwtAuthGuard)
  async discordMe(
    @Req() req: RequestWithUser,
  ): Promise<DiscordUserResponse | { error: string }> {
    try {
      return await this.authService.getDiscordUserWithRefresh(req.user);
    } catch {
      return { error: 'No se pudo obtener el perfil de Discord' };
    }
  }

  @Get('discord/roles')
  @UseGuards(JwtAuthGuard)
  async discordRoles(
    @Req() req: RequestWithUser,
  ): Promise<DiscordRoleResponse[] | { error: string }> {
    try {
      return await this.authService.getGuildRolesForUser(req.user);
    } catch {
      return { error: 'No se pudieron obtener los roles de Discord' };
    }
  }
}
