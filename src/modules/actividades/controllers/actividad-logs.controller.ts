import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ActividadLogsService } from '../services/actividad-logs.service';
import { RegistrarActividadLogDto } from '../dto/registrar-actividad-log.dto';
import { ApiKeyGuard } from '../../recordatorios/guards/api-key.guard';

@Controller('actividad-logs')
export class ActividadLogsController {
  constructor(private readonly service: ActividadLogsService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body() dto: RegistrarActividadLogDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query('eventType') eventType?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = limit
      ? Math.min(Number.parseInt(limit, 10) || 50, 200)
      : 50;
    return this.service.findAll(eventType, parsedLimit);
  }
}
