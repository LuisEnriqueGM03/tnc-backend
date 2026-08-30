import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recordatorio } from '../entities/recordatorio.entity';
import { CrearRecordatorioDto } from '../dto/crear-recordatorio.dto';

@Injectable()
export class RecordatoriosService {
  constructor(
    @InjectRepository(Recordatorio)
    private readonly recordatorioRepository: Repository<Recordatorio>,
  ) {}

  create(dto: CrearRecordatorioDto): Promise<Recordatorio> {
    const recordatorio = this.recordatorioRepository.create(dto);
    return this.recordatorioRepository.save(recordatorio);
  }

  findAll(): Promise<Recordatorio[]> {
    return this.recordatorioRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Recordatorio> {
    const recordatorio = await this.recordatorioRepository.findOne({
      where: { id },
      relations: {
        predefinidos: true,
        tablones: true,
      },
    });

    if (!recordatorio) {
      throw new NotFoundException(`Recordatorio ${id} no encontrado`);
    }

    return recordatorio;
  }

  async remove(id: string): Promise<void> {
    const recordatorio = await this.findOne(id);
    await this.recordatorioRepository.remove(recordatorio);
  }
}
