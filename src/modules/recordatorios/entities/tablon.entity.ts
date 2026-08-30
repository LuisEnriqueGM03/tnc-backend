import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recordatorio } from './recordatorio.entity';

@Entity('tablones')
export class Tablon {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'recordatorio_id', type: 'uuid' })
  recordatorioId!: string;

  @ManyToOne(() => Recordatorio, (recordatorio) => recordatorio.tablones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recordatorio_id' })
  recordatorio!: Recordatorio;

  @Column({ name: 'channel_id', length: 50 })
  channelId!: string;

  @Column({ name: 'message_id', type: 'varchar', length: 50, nullable: true })
  messageId!: string | null;

  @Column({ name: 'embed_color', length: 7, default: '#5865F2' })
  embedColor!: string;

  @Column({ name: 'embed_emoji', type: 'varchar', length: 10, nullable: true })
  embedEmoji!: string | null;

  @Column({ name: 'embed_description', type: 'text', nullable: true })
  embedDescription!: string | null;

  @Column({ name: 'has_custom', default: true })
  hasCustom!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
