import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TablonActividad } from '../entities/tablon-actividad.entity';
import { CrearTablonActividadDto } from '../dto/crear-tablon-actividad.dto';
import { ActualizarTablonActividadDto } from '../dto/actualizar-tablon-actividad.dto';

@Injectable()
export class TablonesActividadService {
  constructor(
    @InjectRepository(TablonActividad)
    private readonly repository: Repository<TablonActividad>,
  ) {}

  create(dto: CrearTablonActividadDto): Promise<TablonActividad> {
    return this.repository.save(
      this.repository.create({
        titulo: dto.titulo,
        descripcion: dto.descripcion ?? null,
        emoji: dto.emoji ?? null,
        color: dto.color ?? '#5865F2',
        channelId: dto.channelId,
      }),
    );
  }

  findAll(): Promise<TablonActividad[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<TablonActividad> {
    const tablon = await this.repository.findOne({
      where: { id },
      relations: { actividades: true },
    });
    if (!tablon) throw new NotFoundException(`Tablón ${id} no encontrado`);
    return tablon;
  }

  async update(
    id: string,
    dto: ActualizarTablonActividadDto,
  ): Promise<TablonActividad> {
    const tablon = await this.findOne(id);
    Object.assign(tablon, dto);
    return this.repository.save(tablon);
  }

  async remove(id: string): Promise<void> {
    const tablon = await this.findOne(id);
    await this.repository.remove(tablon);
  }
}
