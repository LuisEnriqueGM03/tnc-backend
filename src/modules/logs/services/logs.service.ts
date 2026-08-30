import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from '../entities/log.entity';
import { RegistrarLogDto } from '../dto/registrar-log.dto';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  create(dto: RegistrarLogDto): Promise<Log> {
    const log = this.logRepository.create({
      eventType: dto.eventType,
      recordatorioId: dto.recordatorioId ?? null,
      reminderId: dto.reminderId ?? null,
      userId: dto.userId ?? null,
      title: dto.title ?? null,
      frequency: dto.frequency ?? null,
      repetition: dto.repetition ?? null,
      nextFireAt: dto.nextFireAt ? new Date(dto.nextFireAt) : null,
      detail: dto.detail ?? null,
    });

    return this.logRepository.save(log);
  }

  findAll(eventType?: string, limit = 50): Promise<Log[]> {
    return this.logRepository.find({
      where: eventType ? { eventType } : {},
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
