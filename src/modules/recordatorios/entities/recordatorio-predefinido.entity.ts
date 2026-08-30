import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recordatorio } from './recordatorio.entity';

@Entity('recordatorio_predefinidos')
export class RecordatorioPredefinido {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'recordatorio_id', type: 'uuid' })
  recordatorioId!: string;

  @ManyToOne(() => Recordatorio, (recordatorio) => recordatorio.predefinidos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recordatorio_id' })
  recordatorio!: Recordatorio;

  @Column({ length: 50 })
  label!: string;

  @Column({ name: 'interval_seconds', type: 'int' })
  intervalSeconds!: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  emoji!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'int', default: 0 })
  order!: number;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;
}
