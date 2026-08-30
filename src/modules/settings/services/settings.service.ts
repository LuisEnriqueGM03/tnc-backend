import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '../entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  findAll(): Promise<Setting[]> {
    return this.settingRepository.find();
  }

  async findByKey(key: string): Promise<Setting> {
    const setting = await this.settingRepository.findOne({ where: { key } });

    if (!setting) {
      throw new NotFoundException(`Configuración ${key} no encontrada`);
    }

    return setting;
  }

  async upsert(key: string, value: string): Promise<Setting> {
    const existing = await this.settingRepository.findOne({ where: { key } });

    if (existing) {
      existing.value = value;
      return this.settingRepository.save(existing);
    }

    return this.settingRepository.save(
      this.settingRepository.create({ key, value }),
    );
  }
}
