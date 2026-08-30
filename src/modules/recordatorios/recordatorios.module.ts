import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recordatorio } from './entities/recordatorio.entity';
import { Tablon } from './entities/tablon.entity';
import { RecordatorioPredefinido } from './entities/recordatorio-predefinido.entity';
import { ScheduledReminder } from './entities/scheduled-reminder.entity';
import { RecordatoriosController } from './controllers/recordatorios.controller';
import { TablonesController } from './controllers/tablones.controller';
import { PredefinidosController } from './controllers/predefinidos.controller';
import { RemindersController } from './controllers/reminders.controller';
import { RecordatoriosService } from './services/recordatorios.service';
import { TablonesService } from './services/tablones.service';
import { PredefinidosService } from './services/predefinidos.service';
import { RemindersService } from './services/reminders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recordatorio,
      Tablon,
      RecordatorioPredefinido,
      ScheduledReminder,
    ]),
  ],
  controllers: [
    RecordatoriosController,
    TablonesController,
    PredefinidosController,
    RemindersController,
  ],
  providers: [
    RecordatoriosService,
    TablonesService,
    PredefinidosService,
    RemindersService,
  ],
  exports: [RemindersService],
})
export class RecordatoriosModule {}
