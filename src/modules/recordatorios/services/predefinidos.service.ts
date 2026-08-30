import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordatorioPredefinido } from '../entities/recordatorio-predefinido.entity';
import { RecordatoriosService } from './recordatorios.service';
import { CrearPredefinidoDto } from '../dto/crear-predefinido.dto';
import { ActualizarPredefinidoDto } from '../dto/actualizar-predefinido.dto';

@Injectable()
export class PredefinidosService {
  constructor(
    @InjectRepository(RecordatorioPredefinido)
    private readonly predefinidoRepository: Repository<RecordatorioPredefinido>,
    private readonly recordatoriosService: RecordatoriosService,
  ) {}

  async create(dto: CrearPredefinidoDto): Promise<RecordatorioPredefinido> {
    await this.recordatoriosService.findOne(dto.recordatorioId);

    const order =
      dto.order ??
      (await this.predefinidoRepository.count({
        where: { recordatorioId: dto.recordatorioId },
      }));

    const predefinido = this.predefinidoRepository.create({
      recordatorioId: dto.recordatorioId,
      label: dto.label,
      intervalSeconds: dto.intervalSeconds,
      emoji: dto.emoji ?? null,
      description: dto.description ?? null,
      order,
      isActive: true,
    });

    return this.predefinidoRepository.save(predefinido);
  }

  findByRecordatorio(
    recordatorioId: string,
  ): Promise<RecordatorioPredefinido[]> {
    return this.predefinidoRepository.find({
      where: { recordatorioId, isActive: true },
      order: { order: 'ASC' },
    });
  }

  async update(
    id: string,
    dto: ActualizarPredefinidoDto,
  ): Promise<RecordatorioPredefinido> {
    const predefinido = await this.findOne(id);
    Object.assign(predefinido, dto);
    return this.predefinidoRepository.save(predefinido);
  }

  async remove(id: string): Promise<void> {
    const predefinido = await this.findOne(id);
    await this.predefinidoRepository.remove(predefinido);
  }

  async findOne(id: string): Promise<RecordatorioPredefinido> {
    const predefinido = await this.predefinidoRepository.findOne({
      where: { id },
    });

    if (!predefinido) {
      throw new NotFoundException(`Predefinido ${id} no encontrado`);
    }

    return predefinido;
  }
}
