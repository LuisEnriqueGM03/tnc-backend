import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../../recordatorios/guards/api-key.guard';
import { UpsertUserDto } from '../dto/upsert-user.dto';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  upsert(@Body() dto: UpsertUserDto): Promise<User> {
    return this.usersService.upsert(dto);
  }

  @Post('batch')
  @UseGuards(ApiKeyGuard)
  async upsertBatch(@Body() dtos: UpsertUserDto[]): Promise<{ count: number }> {
    await this.usersService.upsertMany(dtos);
    return { count: dtos.length };
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':discordId')
  findByDiscordId(@Param('discordId') discordId: string): Promise<User> {
    return this.usersService.findByDiscordId(discordId);
  }
}
