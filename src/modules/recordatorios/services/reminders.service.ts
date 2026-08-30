import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ScheduledReminder } from '../entities/scheduled-reminder.entity';
import { CrearReminderDto } from '../dto/crear-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(ScheduledReminder)
    private readonly reminderRepository: Repository<ScheduledReminder>,
  ) {}

  create(dto: CrearReminderDto): Promise<ScheduledReminder> {
    const reminder = this.reminderRepository.create({
      userId: dto.userId,
      recordatorioId: dto.recordatorioId ?? null,
      title: dto.title,
      intervalSeconds: dto.intervalSeconds,
      totalCount: dto.totalCount,
      remainingCount: dto.totalCount,
      nextFireAt: new Date(dto.nextFireAt),
      status: 'active',
    });

    return this.reminderRepository.save(reminder);
  }

  findPending(now: Date, windowSeconds: number): Promise<ScheduledReminder[]> {
    const from = now;
    const to = new Date(now.getTime() + windowSeconds * 1000);

    return this.reminderRepository.find({
      where: {
        status: 'active',
        nextFireAt: Between(from, to),
      },
      order: { nextFireAt: 'ASC' },
    });
  }

  findByUser(userId: string, status?: string): Promise<ScheduledReminder[]> {
    if (!userId) {
      throw new BadRequestException('Se requiere userId');
    }

    return this.reminderRepository.find({
      where: {
        userId,
        ...(status ? { status: status as ScheduledReminder['status'] } : {}),
      },
      order: { nextFireAt: 'ASC' },
    });
  }

  countActiveByRecordatorio(recordatorioId: string): Promise<number> {
    return this.reminderRepository.count({
      where: { recordatorioId, status: 'active' },
    });
  }

  async advance(id: string): Promise<ScheduledReminder> {
    const reminder = await this.findOne(id);

    if (reminder.status !== 'active') {
      throw new BadRequestException('El recordatorio no está activo');
    }

    reminder.remainingCount -= 1;

    if (reminder.remainingCount <= 0) {
      reminder.status = 'completed';
    } else {
      reminder.nextFireAt = new Date(
        reminder.nextFireAt.getTime() + reminder.intervalSeconds * 1000,
      );
    }

    return this.reminderRepository.save(reminder);
  }

  async cancel(id: string): Promise<ScheduledReminder> {
    const reminder = await this.findOne(id);

    if (reminder.status !== 'active') {
      throw new BadRequestException('El recordatorio no está activo');
    }

    reminder.status = 'cancelled';
    return this.reminderRepository.save(reminder);
  }

  async findOne(id: string): Promise<ScheduledReminder> {
    const reminder = await this.reminderRepository.findOne({ where: { id } });

    if (!reminder) {
      throw new NotFoundException(
        `Recordatorio programado ${id} no encontrado`,
      );
    }

    return reminder;
  }
}
