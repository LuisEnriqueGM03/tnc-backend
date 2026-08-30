# 05 — Contratos y Exposición de la API REST

Directrices para exponer y versionar los endpoints REST del backend **TNC DiscordGang** (consumidos por el bot standalone).

---

## 1. Principio Rector

El backend es una **API REST exclusivamente**. No gestiona el Gateway de Discord, Slash Commands ni eventos; todo ello vive en el bot (`TNC-DiscordGang-App`). El bot consume esta API mediante un cliente HTTP tipado.

* **Sin dependencia de Discord:** Prohibido importar `discord.js`, `necord` o tokens de Discord en el backend.
* **Desacoplamiento:** La API expone contratos (DTOs) estables; el bot los consume y traduce a respuestas de Discord.

---

## 2. Versionado de la API

* **Prefijo obligatorio en todas las rutas:** `/api/v1/...`.
* **Versionado semántico:** Los cambios *breaking* de contrato requieren un nuevo major (`/api/v2/...`); los cambios compatibles se realizan dentro del mismo major.
* **Definición:** Configurar el prefijo global en `main.ts`:
  ```typescript
  app.setGlobalPrefix('api/v1');
  ```

---

## 3. Estandarización de Respuestas

* **Respuesta exitosa:**
  ```json
  {
    "data": { "...": "..." },
    "meta": { "page": 1, "pageSize": 20, "total": 100 }
  }
  ```
* **Respuesta de error** (centralizada en el `HttpExceptionFilter` global):
  ```json
  {
    "statusCode": 404,
    "timestamp": "2026-08-27T18:04:31.000Z",
    "path": "/api/v1/gang-members/123",
    "error": "Not Found",
    "message": "Miembro con ID 123 no encontrado"
  }
  ```
* **Mensajes en español** y sin exponer *stack traces*, SQL o detalles internos en producción.

---

## 4. Naming de Endpoints (RESTful)

* **Recursos en plural** y kebab-case: `/api/v1/gang-members`.
* **Métodos semánticos:**
  * `GET /gang-members` — listar (con paginación/filtros).
  * `GET /gang-members/:id` — obtener uno.
  * `POST /gang-members` — crear.
  * `PATCH /gang-members/:id` — actualizar parcial.
  * `DELETE /gang-members/:id` — eliminar.

---

## 5. Paginación, Filtros y Ordenamiento

* **Paginación:** parámetros `page` y `pageSize` (o cursor `after`/`before` si el dataset es grande).
* **Filtros:** como *query params* (`?discordId=...&rank=LEADER`).
* **Ordenamiento:** `sort=field` y `sortOrder=asc|desc`.
* Los DTOs de query deben validarse con `class-validator` y el `ValidationPipe` global (`whitelist`, `forbidNonWhitelisted`).

---

## 6. Documentación OpenAPI (Swagger)

* Habilitar Swagger con `@nestjs/swagger` en `main.ts` (solo en `development`):
  ```typescript
  const options = new DocumentBuilder()
    .setTitle('TNC DiscordGang API')
    .setDescription('API REST consumida por el bot de Discord')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);
  ```
* Todo DTO expuesto debe documentarse con `@ApiProperty()` y los controladores con `@ApiTags()` / `@ApiOperation()`.

---

## 7. Autenticación (si aplica)

* Si el backend exige autenticación para el bot, usar API Key o Bearer token vía header `Authorization`.
* **Prohibido** hardcodear credenciales; inyectarlas por variable de entorno y validarlas con `@nestjs/config` + Joi.

---

## 8. Coordinación con el Bot

* El contrato DTO del backend (`src/modules/**/dto/`) debe mantenerse sincronizado con `src/api/types/` del bot.
* Los cambios de contrato se versionan y comunican al equipo del bot antes de mergear.
* El backend **no** depende del bot: el flujo es siempre bot → API.
