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
} from '@nestjs/common';
import { TablonesActividadService } from '../services/tablones-actividad.service';
import { ActivacionesService } from '../services/activaciones.service';
import { CrearTablonActividadDto } from '../dto/crear-tablon-actividad.dto';
import { ActualizarTablonActividadDto } from '../dto/actualizar-tablon-actividad.dto';
import { TablonActividad } from '../entities/tablon-actividad.entity';

@Controller('actividad-tablones')
export class TablonesActividadController {
  constructor(
    private readonly service: TablonesActividadService,
    private readonly activacionesService: ActivacionesService,
  ) {}

  @Post()
  create(@Body() dto: CrearTablonActividadDto): Promise<TablonActividad> {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<TablonActividad[]> {
    return this.service.findAll();
  }

  @Get(':id/activas')
  findActivas(@Param('id', ParseUUIDPipe) id: string) {
    return this.activacionesService.findActivasByTablon(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<TablonActividad> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarTablonActividadDto,
  ): Promise<TablonActividad> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.service.remove(id);
  }
}
