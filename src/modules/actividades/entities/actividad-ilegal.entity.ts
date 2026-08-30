import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TablonActividad } from './tablon-actividad.entity';
import { ActivacionActividad } from './activacion-actividad.entity';

@Entity('actividades_ilegales')
export class ActividadIlegal {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'tablon_id', type: 'uuid' })
  tablonId!: string;

  @ManyToOne(() => TablonActividad, (tablon) => tablon.actividades, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tablon_id' })
  tablon!: TablonActividad;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  emoji!: string | null;

  @Column({ name: 'cooldown_seconds', type: 'int' })
  cooldownSeconds!: number;

  @Column({ name: 'is_global', default: false })
  isGlobal!: boolean;

  @Column({ type: 'int', default: 0 })
  orden!: number;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => ActivacionActividad, (activacion) => activacion.actividad)
  activaciones!: ActivacionActividad[];
}
