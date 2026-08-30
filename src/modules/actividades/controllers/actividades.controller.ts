import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ActividadesService } from '../services/actividades.service';
import { ActivacionesService } from '../services/activaciones.service';
import { CrearActividadDto } from '../dto/crear-actividad.dto';
import { ActualizarActividadDto } from '../dto/actualizar-actividad.dto';
import { ActivarActividadDto } from '../dto/activar-actividad.dto';
import { ActividadIlegal } from '../entities/actividad-ilegal.entity';
import { ApiKeyGuard } from '../../recordatorios/guards/api-key.guard';

@Controller('actividades')
export class ActividadesController {
  constructor(
    private readonly service: ActividadesService,
    private readonly activacionesService: ActivacionesService,
  ) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body() dto: CrearActividadDto): Promise<ActividadIlegal> {
    return this.service.create(dto);
  }

  @Get()
  findByTablon(
    @Query('tablonId', ParseUUIDPipe) tablonId: string,
  ): Promise<ActividadIlegal[]> {
    return this.service.findByTablon(tablonId);
  }

  @Get(':id/activa')
  findActiva(@Param('id', ParseUUIDPipe) id: string) {
    return this.activacionesService.findActiva(id);
  }

  @Post(':id/activar')
  @UseGuards(ApiKeyGuard)
  activar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActivarActividadDto,
  ) {
    return this.activacionesService.activar(id, dto.userId);
  }

  @Post(':id/cancelar')
  @UseGuards(ApiKeyGuard)
  cancelar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActivarActividadDto,
  ) {
    return this.activacionesService.cancelar(id, dto.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ActividadIlegal> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarActividadDto,
  ): Promise<ActividadIlegal> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ApiKeyGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.service.remove(id);
  }
}
