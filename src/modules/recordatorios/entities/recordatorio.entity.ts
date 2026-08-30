import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RecordatorioPredefinido } from './recordatorio-predefinido.entity';
import { ScheduledReminder } from './scheduled-reminder.entity';
import { Tablon } from './tablon.entity';
import { User } from '../../users/entities/user.entity';

@Entity('recordatorios')
export class Recordatorio {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ name: 'created_by', length: 50 })
  createdBy!: string;

  @ManyToOne(() => User, (user) => user.recordatoriosCreados)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'discordId' })
  createdByUser!: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => Tablon, (tablon) => tablon.recordatorio)
  tablones!: Tablon[];

  @OneToMany(
    () => RecordatorioPredefinido,
    (predefinido) => predefinido.recordatorio,
  )
  predefinidos!: RecordatorioPredefinido[];

  @OneToMany(() => ScheduledReminder, (reminder) => reminder.recordatorio)
  reminders!: ScheduledReminder[];
}
