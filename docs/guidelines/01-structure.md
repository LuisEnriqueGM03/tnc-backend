# Arquitectura Base - TNC DiscordGang (NestJS)

Este documento define la estructura, reglas arquitectónicas y convenciones de código para el desarrollo del backend del bot **TNC DiscordGang** utilizando NestJS y TypeScript.

---

## 1. Estructura de Directorios

La arquitectura está diseñada para escalar basándose en dominios y características (Feature/Domain-driven).

```text
tnc-discordgang-backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/                      # Configuración centralizada y validada
│   │   ├── app.config.ts            
│   │   └── env.validation.ts        
│   ├── common/                      # Código agnóstico al dominio (reutilizable)
│   │   ├── decorators/
│   │   ├── filters/                 
│   │   ├── guards/                  
│   │   └── interceptors/            
│   └── modules/                     # Módulos de Dominio (Características aisladas)
│       ├── gang-members/            # Módulo: miembros de la gang
│       │   ├── gang-members.module.ts
│       │   ├── gang-members.controller.ts
│       │   ├── gang-members.service.ts
│       │   ├── dto/
│       │   │   ├── create-gang-member.dto.ts
│       │   │   └── update-gang-member.dto.ts
│       │   └── entities/
│       │       └── gang-member.entity.ts
│       ├── recordatorios/           # Módulo: recordatorios/tablones
│       │   ├── recordatorios.module.ts
│       │   ├── entities/
│       │   │   ├── recordatorio.entity.ts
│       │   │   ├── tablon.entity.ts
│       │   │   ├── recordatorio-predefinido.entity.ts
│       │   │   └── scheduled-reminder.entity.ts
│       │   ├── controllers/
│       │   ├── services/
│       │   ├── dto/
│       │   └── guards/
│       │       └── api-key.guard.ts
│       ├── settings/                # Módulo: configuración key-value
│       │   ├── settings.module.ts
│       │   ├── settings.entity.ts
│       │   ├── settings.controller.ts
│       │   └── settings.service.ts
│       ├── logs/                    # Módulo: historial de eventos
│       │   ├── logs.module.ts
│       │   ├── log.entity.ts
│       │   ├── logs.controller.ts
│       │   └── logs.service.ts
│       └── tareas/                  # Módulo futuro (ejemplo de extensión)
├── .env
├── nest-cli.json
├── package.json
└── tsconfig.json
```

---

## 2. Normativas de Desarrollo

### 2.1. Organización por módulos de dominio
- Cada dominio/feature vive en `src/modules/<dominio>/` con su propio módulo de NestJS.
- **Prohibido** usar carpetas `services/`, `controllers/` globales. Cada controlador, servicio, DTO y entidad pertenece exclusivamente a su módulo de dominio.
- **Módulos autocontenidos:** cada módulo incluye sus entities, controllers, services, DTOs y guards propios. No compartir repositories entre módulos.
- **Reutilización entre módulos:** si un módulo necesita la funcionalidad de otro (ej. `tareas` quiere programar recordatorios), importa el módulo y inyecta su servicio **exportado**. Nunca instanciar clases directamente con `new`.
- **Cada módulo es un "feature module"** independiente; el patrón se replica para futuros dominios (recordatorios, tareas, etc.).

### 2.2. Convenciones de Nomenclatura (Naming)
- **Archivos:** Siempre en **kebab-case** (ej. `crear-usuario.dto.ts`, `gang-members.service.ts`).
- **Clases:** Siempre en **PascalCase** (ej. `GangMembersService`, `CreateUserDto`).
- **Sufijos:** Las clases deben indicar su rol en el ecosistema NestJS al final del nombre: `Module`, `Controller`, `Service`, `Guard`, `Interceptor`, `Pipe`, `Filter`.

### 2.3. Capas y Dependencias (Inyección de Dependencias)
- **Flujo Estricto:** `Controller` → `Service` → `Repository / Base de Datos / API externa`.
- La **lógica de negocio** debe residir 100% en el `Service`. El Controller solo recibe la petición, delega al servicio y formatea la respuesta.
- **Comunicación entre módulos:** Si el `GangMembersModule` necesita información de otro módulo, debe importarlo e inyectar su servicio. Nunca instanciar clases directamente con `new`.
- **Cero Dependencias Circulares:** Evitar que el Módulo A importe al Módulo B y viceversa. Si esto ocurre, la lógica compartida debe extraerse a un Módulo C.

### 2.4. Configuración y Variables de Entorno
- Uso obligatorio de `@nestjs/config`.
- **NUNCA** acceder a `process.env.VARIABLE` a lo largo del código.
- Toda variable debe estar validada (mediante Joi, Zod o class-validator) en el directorio `src/config/`.
- Acceder a los valores inyectando el `ConfigService` proporcionado por NestJS.

---

## 3. Patrones de Implementación (Snippets)

### 3.1. Validación de Entorno (`src/config/env.validation.ts`)
```typescript
import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().allow(''),
  DATABASE_NAME: Joi.string().required(),
});
```

### 3.2. Estructura de un Módulo de Dominio (`gang-members.module.ts`)
```typescript
import { Module } from '@nestjs/common';
import { GangMembersService } from './gang-members.service';
import { GangMembersController } from './gang-members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GangMember } from './entities/gang-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GangMember])], // Si se usa TypeORM
  controllers: [GangMembersController],
  providers: [GangMembersService],
  exports: [GangMembersService], // Se exporta para que otros módulos lo usen
})
export class GangMembersModule {}
```

### 3.3. Estructura de un Servicio (`gang-members.service.ts`)
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGangMemberDto } from './dto/create-gang-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GangMember } from './entities/gang-member.entity';

@Injectable()
export class GangMembersService {
  constructor(
    @InjectRepository(GangMember)
    private readonly memberRepository: Repository<GangMember>,
  ) {}

  async create(createMemberDto: CreateGangMemberDto): Promise<GangMember> {
    const newMember = this.memberRepository.create(createMemberDto);
    return await this.memberRepository.save(newMember);
  }

  async findOneByDiscordId(discordId: string): Promise<GangMember> {
    const member = await this.memberRepository.findOne({ where: { discordId } });
    if (!member) {
      throw new NotFoundException(`Miembro con ID de Discord ${discordId} no encontrado`);
    }
    return member;
  }
}
```