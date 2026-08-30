import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActividadIlegal } from '../entities/actividad-ilegal.entity';
import { CrearActividadDto } from '../dto/crear-actividad.dto';
import { ActualizarActividadDto } from '../dto/actualizar-actividad.dto';
import { TablonesActividadService } from './tablones-actividad.service';

@Injectable()
export class ActividadesService {
  constructor(
    @InjectRepository(ActividadIlegal)
    private readonly repository: Repository<ActividadIlegal>,
    private readonly tablonesService: TablonesActividadService,
  ) {}

  async create(dto: CrearActividadDto): Promise<ActividadIlegal> {
    await this.tablonesService.findOne(dto.tablonId);
    const orden =
      dto.orden ??
      (await this.repository.count({ where: { tablonId: dto.tablonId } }));
    return this.repository.save(
      this.repository.create({
        tablonId: dto.tablonId,
        nombre: dto.nombre,
        cooldownSeconds: dto.cooldownSeconds,
        emoji: dto.emoji ?? null,
        descripcion: dto.descripcion ?? null,
        isGlobal: dto.isGlobal ?? false,
        orden,
        isActive: true,
      }),
    );
  }

  findByTablon(tablonId: string): Promise<ActividadIlegal[]> {
    return this.repository.find({
      where: { tablonId, isActive: true },
      order: { orden: 'ASC' },
    });
  }

  async findOne(id: string): Promise<ActividadIlegal> {
    const actividad = await this.repository.findOne({ where: { id } });
    if (!actividad)
      throw new NotFoundException(`Actividad ${id} no encontrada`);
    return actividad;
  }

  async update(
    id: string,
    dto: ActualizarActividadDto,
  ): Promise<ActividadIlegal> {
    const actividad = await this.findOne(id);
    Object.assign(actividad, dto);
    return this.repository.save(actividad);
  }

  async remove(id: string): Promise<void> {
    const actividad = await this.findOne(id);
    await this.repository.remove(actividad);
  }
}
