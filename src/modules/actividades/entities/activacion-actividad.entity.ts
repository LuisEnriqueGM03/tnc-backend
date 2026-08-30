import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActividadIlegal } from './actividad-ilegal.entity';

@Entity('activaciones_actividad')
export class ActivacionActividad {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'actividad_id', type: 'uuid' })
  actividadId!: string;

  @ManyToOne(() => ActividadIlegal, (actividad) => actividad.activaciones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'actividad_id' })
  actividad!: ActividadIlegal;

  @Column({ name: 'user_id', type: 'varchar', length: 50 })
  userId!: string;

  @Column({ name: 'activated_at', type: 'timestamptz' })
  activatedAt!: Date;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ type: 'varchar', length: 20, default: 'activa' })
  status!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
