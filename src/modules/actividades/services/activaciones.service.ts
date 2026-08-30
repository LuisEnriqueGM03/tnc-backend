import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThan, Repository } from 'typeorm';
import { ActivacionActividad } from '../entities/activacion-actividad.entity';
import { ActividadesService } from './actividades.service';

@Injectable()
export class ActivacionesService {
  constructor(
    @InjectRepository(ActivacionActividad)
    private readonly repository: Repository<ActivacionActividad>,
    private readonly actividadesService: ActividadesService,
  ) {}

  async activar(
    actividadId: string,
    userId: string,
  ): Promise<{
    status: 'ok' | 'cooldown';
    activacion?: ActivacionActividad;
    activadorId?: string;
    disponibleEnSegundos?: number;
  }> {
    const actividad = await this.actividadesService.findOne(actividadId);

    if (actividad.isGlobal) {
      const active = await this.repository
        .createQueryBuilder('a')
        .where('a.actividad_id = :id', { id: actividadId })
        .andWhere('a.status = :s', { s: 'activa' })
        .andWhere('a.expires_at > NOW()')
        .getOne();

      if (active) {
        const segundos = Math.ceil(
          (active.expiresAt.getTime() - Date.now()) / 1000,
        );
        return {
          status: 'cooldown',
          activadorId: active.userId,
          disponibleEnSegundos: segundos,
        };
      }
    } else {
      const active = await this.repository
        .createQueryBuilder('a')
        .where('a.actividad_id = :id', { id: actividadId })
        .andWhere('a.user_id = :uid', { uid: userId })
        .andWhere('a.status = :s', { s: 'activa' })
        .andWhere('a.expires_at > NOW()')
        .getOne();

      if (active) {
        const segundos = Math.ceil(
          (active.expiresAt.getTime() - Date.now()) / 1000,
        );
        return { status: 'cooldown', disponibleEnSegundos: segundos };
      }
    }

    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + actividad.cooldownSeconds * 1000,
    );
    const activacion = await this.repository.save(
      this.repository.create({
        actividadId,
        userId,
        activatedAt: now,
        expiresAt,
        status: 'activa',
      }),
    );

    return { status: 'ok', activacion };
  }

  async cancelarPorId(
    id: string,
    userId: string,
  ): Promise<ActivacionActividad> {
    const activacion = await this.repository.findOne({
      where: { id, status: 'activa', expiresAt: MoreThan(new Date()) },
      relations: { actividad: true },
    });
    if (!activacion)
      throw new NotFoundException('Activación activa no encontrada');
    if (activacion.userId !== userId)
      throw new ForbiddenException('Esta activación no te pertenece');
    activacion.status = 'cancelada';
    return this.repository.save(activacion);
  }

  async cancelar(
    actividadId: string,
    userId: string,
  ): Promise<ActivacionActividad> {
    await this.actividadesService.findOne(actividadId);
    const activacion = await this.repository
      .createQueryBuilder('a')
      .where('a.actividad_id = :id', { id: actividadId })
      .andWhere('a.user_id = :uid', { uid: userId })
      .andWhere('a.status = :s', { s: 'activa' })
      .andWhere('a.expires_at > NOW()')
      .getOne();

    if (!activacion)
      throw new NotFoundException('No hay activación activa para cancelar');

    activacion.status = 'cancelada';
    return this.repository.save(activacion);
  }

  findPending(
    now: Date,
    windowSeconds: number,
  ): Promise<ActivacionActividad[]> {
    const from = now;
    const to = new Date(now.getTime() + windowSeconds * 1000);
    return this.repository.find({
      where: { status: 'activa', expiresAt: Between(from, to) },
      order: { expiresAt: 'ASC' },
    });
  }

  async expirar(id: string): Promise<ActivacionActividad> {
    const activacion = await this.repository.findOne({ where: { id } });
    if (!activacion) throw new NotFoundException('Activación no encontrada');
    activacion.status = 'completada';
    return this.repository.save(activacion);
  }

  async findActiva(actividadId: string): Promise<ActivacionActividad | null> {
    return this.repository
      .createQueryBuilder('a')
      .where('a.actividad_id = :id', { id: actividadId })
      .andWhere('a.status = :s', { s: 'activa' })
      .andWhere('a.expires_at > NOW()')
      .getOne();
  }

  async findActivasByTablon(tablonId: string): Promise<ActivacionActividad[]> {
    return this.repository
      .createQueryBuilder('a')
      .innerJoin('a.actividad', 'act')
      .where('act.tablon_id = :tid', { tid: tablonId })
      .andWhere('a.status = :s', { s: 'activa' })
      .andWhere('a.expires_at > NOW()')
      .getMany();
  }

  findAll(filters: {
    userId?: string;
    actividadId?: string;
    limit?: number;
  }): Promise<ActivacionActividad[]> {
    const where: Record<string, unknown> = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.actividadId) where.actividadId = filters.actividadId;
    return this.repository.find({
      where,
      relations: { actividad: true },
      order: { createdAt: 'DESC' },
      take: filters.limit ?? 50,
    });
  }

  findActivasByUser(userId: string): Promise<ActivacionActividad[]> {
    return this.repository.find({
      where: { userId, status: 'activa', expiresAt: MoreThan(new Date()) },
      relations: { actividad: true },
      order: { expiresAt: 'ASC' },
    });
  }

  findEnCurso(): Promise<ActivacionActividad[]> {
    return this.repository.find({
      where: { status: 'activa', expiresAt: MoreThan(new Date()) },
      relations: { actividad: true },
      order: { expiresAt: 'ASC' },
    });
  }

  findEnCooldown(hours = 24): Promise<ActivacionActividad[]> {
    const desde = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.repository.find({
      where: { status: 'completada', createdAt: MoreThan(desde) },
      relations: { actividad: true },
      order: { createdAt: 'DESC' },
    });
  }

  findHistorial(limit = 50, page = 1): Promise<ActivacionActividad[]> {
    return this.repository.find({
      where: [{ status: 'completada' }, { status: 'cancelada' }],
      relations: { actividad: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
