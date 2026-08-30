import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ActivacionesService } from '../services/activaciones.service';
import { ActivarActividadDto } from '../dto/activar-actividad.dto';

@Controller('activaciones')
export class ActivacionesController {
  constructor(private readonly service: ActivacionesService) {}

  @Get('pending')
  findPending(@Query('now') now?: string, @Query('window') window?: string) {
    const since = now ? new Date(now) : new Date();
    const windowSeconds = window ? Number.parseInt(window, 10) || 86400 : 86400;
    return this.service.findPending(since, windowSeconds);
  }

  @Get('activas')
  findActivasByUser(@Query('userId') userId?: string) {
    if (!userId) return [];
    return this.service.findActivasByUser(userId);
  }

  @Get()
  findAll(
    @Query('userId') userId?: string,
    @Query('actividadId') actividadId?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = limit
      ? Math.min(Number.parseInt(limit, 10) || 50, 200)
      : 50;
    return this.service.findAll({ userId, actividadId, limit: parsedLimit });
  }

  @Get('en-curso')
  findEnCurso() {
    return this.service.findEnCurso();
  }

  @Get('en-cooldown')
  findEnCooldown(@Query('hours') hours?: string) {
    const parsedHours = hours ? Number.parseInt(hours, 10) || 24 : 24;
    return this.service.findEnCooldown(parsedHours);
  }

  @Get('historial')
  findHistorial(@Query('limit') limit?: string, @Query('page') page?: string) {
    const parsedLimit = limit
      ? Math.min(Number.parseInt(limit, 10) || 50, 200)
      : 50;
    const parsedPage = page ? Number.parseInt(page, 10) || 1 : 1;
    return this.service.findHistorial(parsedLimit, parsedPage);
  }

  @Post(':id/cancelar')
  async cancelarPorId(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActivarActividadDto,
  ) {
    return this.service.cancelarPorId(id, dto.userId);
  }

  @Delete(':id')
  async expirar(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.expirar(id);
  }
}
