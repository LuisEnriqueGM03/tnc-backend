import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { LogsService } from '../services/logs.service';
import { RegistrarLogDto } from '../dto/registrar-log.dto';
import { ApiKeyGuard } from '../../recordatorios/guards/api-key.guard';
import { Log } from '../entities/log.entity';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body() dto: RegistrarLogDto): Promise<Log> {
    return this.logsService.create(dto);
  }

  @Get()
  findAll(
    @Query('eventType') eventType?: string,
    @Query('limit') limit?: string,
  ): Promise<Log[]> {
    const parsedLimit = limit
      ? Math.min(Number.parseInt(limit, 10) || 50, 200)
      : 50;
    return this.logsService.findAll(eventType, parsedLimit);
  }
}
