import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfig } from './config/configuration';
import configuration from './config/configuration';
import { LogsModule } from './modules/logs/logs.module';
import { RecordatoriosModule } from './modules/recordatorios/recordatorios.module';
import { SettingsModule } from './modules/settings/settings.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ActividadesModule } from './modules/actividades/actividades.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const database = configService.getOrThrow<DatabaseConfig>('database');

        return {
          type: 'postgres',
          host: database.host,
          port: database.port,
          username: database.username,
          password: database.password,
          database: database.database,
          autoLoadEntities: true,
          synchronize: database.synchronize,
        };
      },
    }),
    RecordatoriosModule,
    SettingsModule,
    LogsModule,
    UsersModule,
    AuthModule,
    ActividadesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
