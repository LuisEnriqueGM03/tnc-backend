import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { RecordatoriosService } from '../services/recordatorios.service';
import { CrearRecordatorioDto } from '../dto/crear-recordatorio.dto';
import { Recordatorio } from '../entities/recordatorio.entity';

@Controller('recordatorios')
export class RecordatoriosController {
  constructor(private readonly recordatoriosService: RecordatoriosService) {}

  @Post()
  create(@Body() dto: CrearRecordatorioDto): Promise<Recordatorio> {
    return this.recordatoriosService.create(dto);
  }

  @Get()
  findAll(): Promise<Recordatorio[]> {
    return this.recordatoriosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Recordatorio> {
    return this.recordatoriosService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.recordatoriosService.remove(id);
  }
}
