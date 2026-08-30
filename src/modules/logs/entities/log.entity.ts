import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'event_type', length: 40 })
  eventType!: string;

  @Column({ name: 'recordatorio_id', type: 'uuid', nullable: true })
  recordatorioId!: string | null;

  @Column({ name: 'reminder_id', type: 'uuid', nullable: true })
  reminderId!: string | null;

  @Column({ name: 'user_id', type: 'varchar', length: 50, nullable: true })
  userId!: string | null;

  @ManyToOne(() => User, (user) => user.logs, { nullable: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'discordId' })
  user!: User | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  title!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  frequency!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  repetition!: string | null;

  @Column({ name: 'next_fire_at', type: 'timestamptz', nullable: true })
  nextFireAt!: Date | null;

  @Column({ type: 'text', nullable: true })
  detail!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
