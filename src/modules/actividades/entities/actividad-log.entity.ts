import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('actividad_logs')
export class ActividadLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'event_type', length: 40 })
  eventType!: string;

  @Column({ name: 'tablon_id', type: 'uuid', nullable: true })
  tablonId!: string | null;

  @Column({ name: 'actividad_id', type: 'uuid', nullable: true })
  actividadId!: string | null;

  @Column({ name: 'user_id', type: 'varchar', length: 50, nullable: true })
  userId!: string | null;

  @Column({ type: 'text', nullable: true })
  detalle!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
