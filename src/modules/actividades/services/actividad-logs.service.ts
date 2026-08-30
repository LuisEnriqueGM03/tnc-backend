import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActividadLog } from '../entities/actividad-log.entity';
import { RegistrarActividadLogDto } from '../dto/registrar-actividad-log.dto';

@Injectable()
export class ActividadLogsService {
  constructor(
    @InjectRepository(ActividadLog)
    private readonly repository: Repository<ActividadLog>,
  ) {}

  create(dto: RegistrarActividadLogDto): Promise<ActividadLog> {
    return this.repository.save(
      this.repository.create({
        eventType: dto.eventType,
        tablonId: dto.tablonId ?? null,
        actividadId: dto.actividadId ?? null,
        userId: dto.userId ?? null,
        detalle: dto.detalle ?? null,
      }),
    );
  }

  findAll(eventType?: string, limit = 50): Promise<ActividadLog[]> {
    return this.repository.find({
      where: eventType ? { eventType } : {},
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
