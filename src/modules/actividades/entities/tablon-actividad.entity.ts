import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActividadIlegal } from './actividad-ilegal.entity';

@Entity('tablones_actividad')
export class TablonActividad {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  titulo!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  emoji!: string | null;

  @Column({ type: 'varchar', length: 7, default: '#5865F2' })
  color!: string;

  @Column({ name: 'channel_id', length: 50 })
  channelId!: string;

  @Column({ name: 'message_id', type: 'varchar', length: 50, nullable: true })
  messageId!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => ActividadIlegal, (actividad) => actividad.tablon)
  actividades!: ActividadIlegal[];
}
