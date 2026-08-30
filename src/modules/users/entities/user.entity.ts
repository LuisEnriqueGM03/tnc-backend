import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ScheduledReminder } from '../../recordatorios/entities/scheduled-reminder.entity';
import { Recordatorio } from '../../recordatorios/entities/recordatorio.entity';
import { Log } from '../../logs/entities/log.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'discord_id', length: 50, unique: true })
  discordId!: string;

  @Column({ length: 100 })
  username!: string;

  @Column({ name: 'global_name', type: 'varchar', length: 100, nullable: true })
  globalName!: string | null;

  @Column({ name: 'avatar_url', type: 'text', nullable: true })
  avatarUrl!: string | null;

  @Column({ name: 'joined_at', type: 'timestamptz', nullable: true })
  joinedAt!: Date | null;

  @Column({ name: 'last_seen_at', type: 'timestamptz' })
  lastSeenAt!: Date;

  @Column({ name: 'discord_access_token', type: 'text', nullable: true })
  discordAccessToken!: string | null;

  @Column({ name: 'discord_refresh_token', type: 'text', nullable: true })
  discordRefreshToken!: string | null;

  @Column({
    name: 'discord_token_expires_at',
    type: 'timestamptz',
    nullable: true,
  })
  discordTokenExpiresAt!: Date | null;

  @Column({
    name: 'guild_roles',
    type: 'jsonb',
    nullable: true,
  })
  guildRoles!: Array<{
    id: string;
    name: string;
    color: number;
    position: number;
  }> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => ScheduledReminder, (reminder) => reminder.user)
  reminders!: ScheduledReminder[];

  @OneToMany(() => Recordatorio, (recordatorio) => recordatorio.createdByUser)
  recordatoriosCreados!: Recordatorio[];

  @OneToMany(() => Log, (log) => log.user)
  logs!: Log[];
}
