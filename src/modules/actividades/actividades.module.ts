import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TablonActividad } from './entities/tablon-actividad.entity';
import { ActividadIlegal } from './entities/actividad-ilegal.entity';
import { ActivacionActividad } from './entities/activacion-actividad.entity';
import { ActividadLog } from './entities/actividad-log.entity';
import { TablonesActividadController } from './controllers/tablones-actividad.controller';
import { ActividadesController } from './controllers/actividades.controller';
import { ActivacionesController } from './controllers/activaciones.controller';
import { ActividadLogsController } from './controllers/actividad-logs.controller';
import { TablonesActividadService } from './services/tablones-actividad.service';
import { ActividadesService } from './services/actividades.service';
import { ActivacionesService } from './services/activaciones.service';
import { ActividadLogsService } from './services/actividad-logs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TablonActividad,
      ActividadIlegal,
      ActivacionActividad,
      ActividadLog,
    ]),
  ],
  controllers: [
    TablonesActividadController,
    ActividadesController,
    ActivacionesController,
    ActividadLogsController,
  ],
  providers: [
    TablonesActividadService,
    ActividadesService,
    ActivacionesService,
    ActividadLogsService,
  ],
  exports: [ActividadesService, ActivacionesService],
})
export class ActividadesModule {}
