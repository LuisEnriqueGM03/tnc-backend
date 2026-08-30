import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tablon } from '../entities/tablon.entity';
import { RecordatoriosService } from './recordatorios.service';
import { CrearTablonDto } from '../dto/crear-tablon.dto';
import { ActualizarTablonDto } from '../dto/actualizar-tablon.dto';

@Injectable()
export class TablonesService {
  constructor(
    @InjectRepository(Tablon)
    private readonly tablonRepository: Repository<Tablon>,
    private readonly recordatoriosService: RecordatoriosService,
  ) {}

  async create(dto: CrearTablonDto): Promise<Tablon> {
    await this.recordatoriosService.findOne(dto.recordatorioId);

    const tablon = this.tablonRepository.create({
      recordatorioId: dto.recordatorioId,
      channelId: dto.channelId,
      embedColor: dto.embedColor ?? '#5865F2',
      embedEmoji: dto.embedEmoji ?? null,
      embedDescription: dto.embedDescription ?? null,
      hasCustom: dto.hasCustom ?? true,
    });

    return this.tablonRepository.save(tablon);
  }

  findByRecordatorio(recordatorioId: string): Promise<Tablon | null> {
    return this.tablonRepository.findOne({ where: { recordatorioId } });
  }

  findAll(): Promise<Tablon[]> {
    return this.tablonRepository.find({ order: { createdAt: 'DESC' } });
  }

  async update(id: string, dto: ActualizarTablonDto): Promise<Tablon> {
    const tablon = await this.findOne(id);
    Object.assign(tablon, dto);
    return this.tablonRepository.save(tablon);
  }

  async remove(id: string): Promise<void> {
    const tablon = await this.findOne(id);
    await this.tablonRepository.remove(tablon);
  }

  async findOne(id: string): Promise<Tablon> {
    const tablon = await this.tablonRepository.findOne({ where: { id } });

    if (!tablon) {
      throw new NotFoundException(`Tablón ${id} no encontrado`);
    }

    return tablon;
  }
}
