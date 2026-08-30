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
import { TablonesService } from '../services/tablones.service';
import { CrearTablonDto } from '../dto/crear-tablon.dto';
import { ActualizarTablonDto } from '../dto/actualizar-tablon.dto';
import { Tablon } from '../entities/tablon.entity';

@Controller('tablones')
export class TablonesController {
  constructor(private readonly tablonesService: TablonesService) {}

  @Post()
  create(@Body() dto: CrearTablonDto): Promise<Tablon> {
    return this.tablonesService.create(dto);
  }

  @Get()
  findAll(): Promise<Tablon[]> {
    return this.tablonesService.findAll();
  }

  @Get('by-recordatorio/:recordatorioId')
  findByRecordatorio(
    @Param('recordatorioId', ParseUUIDPipe) recordatorioId: string,
  ): Promise<Tablon | null> {
    return this.tablonesService.findByRecordatorio(recordatorioId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Tablon> {
    return this.tablonesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarTablonDto,
  ): Promise<Tablon> {
    return this.tablonesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.tablonesService.remove(id);
  }
}
