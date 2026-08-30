import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recordatorio } from './recordatorio.entity';
import { User } from '../../users/entities/user.entity';

export type ScheduledReminderStatus = 'active' | 'completed' | 'cancelled';

@Entity('scheduled_reminders')
export class ScheduledReminder {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', length: 50 })
  userId!: string;

  @ManyToOne(() => User, (user) => user.reminders)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'discordId' })
  user!: User;

  @Column({ name: 'recordatorio_id', type: 'uuid', nullable: true })
  recordatorioId!: string | null;

  @ManyToOne(() => Recordatorio, (recordatorio) => recordatorio.reminders, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'recordatorio_id' })
  recordatorio!: Recordatorio | null;

  @Column({ length: 200 })
  title!: string;

  @Column({ name: 'interval_seconds', type: 'int' })
  intervalSeconds!: number;

  @Column({ name: 'total_count', type: 'int' })
  totalCount!: number;

  @Column({ name: 'remaining_count', type: 'int' })
  remainingCount!: number;

  @Column({ name: 'next_fire_at', type: 'timestamptz' })
  nextFireAt!: Date;

  @Column({ length: 20, default: 'active' })
  status!: ScheduledReminderStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
