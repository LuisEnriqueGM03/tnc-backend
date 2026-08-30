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
} from '@nestjs/common';
import { PredefinidosService } from '../services/predefinidos.service';
import { CrearPredefinidoDto } from '../dto/crear-predefinido.dto';
import { ActualizarPredefinidoDto } from '../dto/actualizar-predefinido.dto';
import { RecordatorioPredefinido } from '../entities/recordatorio-predefinido.entity';

@Controller('predefinidos')
export class PredefinidosController {
  constructor(private readonly predefinidosService: PredefinidosService) {}

  @Post()
  create(@Body() dto: CrearPredefinidoDto): Promise<RecordatorioPredefinido> {
    return this.predefinidosService.create(dto);
  }

  @Get()
  findByRecordatorio(
    @Query('recordatorioId', ParseUUIDPipe) recordatorioId: string,
  ): Promise<RecordatorioPredefinido[]> {
    return this.predefinidosService.findByRecordatorio(recordatorioId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RecordatorioPredefinido> {
    return this.predefinidosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarPredefinidoDto,
  ): Promise<RecordatorioPredefinido> {
    return this.predefinidosService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.predefinidosService.remove(id);
  }
}
