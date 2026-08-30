import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { SettingsService } from '../services/settings.service';
import { ActualizarSettingDto } from '../dto/actualizar-setting.dto';
import { ApiKeyGuard } from '../../recordatorios/guards/api-key.guard';
import { Setting } from '../entities/setting.entity';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findAll(): Promise<Setting[]> {
    return this.settingsService.findAll();
  }

  @Get(':key')
  findByKey(@Param('key') key: string): Promise<Setting> {
    return this.settingsService.findByKey(key);
  }

  @Put(':key')
  @UseGuards(ApiKeyGuard)
  update(
    @Param('key') key: string,
    @Body() dto: ActualizarSettingDto,
  ): Promise<Setting> {
    return this.settingsService.upsert(key, dto.value);
  }
}
