# 04 — Calidad, Testing y Manejo de Errores

Directrices de aseguramiento de calidad, testing automatizado, gestión resiliente de excepciones y observabilidad para el ecosistema NestJS.

---

## 1. Estrategia de Testing

El proyecto utiliza **Jest** como ejecutor principal de pruebas junto con las utilidades de `@nestjs/testing` y **Supertest** para pruebas de integración/E2E.

### 1.1. Tipos de Pruebas y Ubicación

* **Pruebas Unitarias (`*.spec.ts`):**
  * Ubicadas contiguas al archivo de código fuente bajo prueba (ej. `users.service.ts` $
    ightarrow$ `users.service.spec.ts`).
  * Focalizadas en la lógica de negocio pura (servicios, use cases, pipes y guards).
  * **Aislamiento:** Obligatorio mockear todas las dependencias externas (repositorios, clientes HTTP, APIs externas) mediante `jest.fn()` o factories de mocks.
* **Pruebas End-to-End / Integración (`*.e2e-spec.ts`):**
  * Ubicadas en el directorio `test/` o dentro del módulo en escenarios de integración.
  * Validan el flujo HTTP completo (Middlewares, Guards, Interceptors, Pipes, Controladores).

### 1.2. Estructura y Semántica de los Tests

Seguir el patrón **AAA (Arrange, Act, Assert)** o **Given-When-Then** con descripciones en español:

```typescript
describe('UsersService', () => {
  let service: UsersService;
  let repository: MockType<Repository<UserEntity>>;

  beforeEach(async () => {
    // Configuración del Test Module y resolución de dependencias
  });

  describe('findById', () => {
    it('debería retornar el usuario cuando existe en la base de datos', async () => {
      // Arrange & Act & Assert
    });

    it('debería lanzar NotFoundException si el usuario no existe', async () => {
      // Assert rejection
    });
  });
});
```

### 1.3. Métricas de Cobertura y Comandos

* **Meta de Cobertura:** Mínimo **80%** en branches, funciones y líneas de la capa de servicios/dominio.
* **Comandos de Ejecución:**
  ```bash
  npm run test          # Ejecución de pruebas unitarias
  npm run test:watch    # Modo interactivo durante desarrollo
  npm run test:cov      # Reporte detallado de cobertura (LCOV/HTML)
  npm run test:e2e      # Pruebas de integración E2E
  ```

---

## 2. Gestión de Errores y Excepciones

* **Excepciones Estándar de NestJS:** Utilizar las subclases de `HttpException` (`NotFoundException`, `BadRequestException`, `UnauthorizedException`, `ConflictException`, `ForbiddenException`) para respuestas semánticas REST.
* **Excepciones de Dominio:** Definir errores de dominio desacoplados del protocolo HTTP en el núcleo del negocio y mapearlos mediante filtros de infraestructura.
* **Filtro Global de Excepciones (`HttpExceptionFilter`):**
  * Centralizar la captura de excepciones no controladas (`Error`, `QueryFailedError`, etc.) para evitar caídas del proceso.
  * Estandarizar la estructura de respuesta de error:
    ```json
    {
      "statusCode": 404,
      "timestamp": "2026-08-27T18:04:31.000Z",
      "path": "/api/v1/users/123",
      "error": "Not Found",
      "message": "Usuario con ID 123 no encontrado"
    }
    ```
* **Seguridad de Respuestas:** Prohibido retornar *stack traces*, detalles de conexión o sentencias SQL crudas al cliente en entornos de producción (`NODE_ENV=production`).

---

## 3. Observabilidad y Logging

* **Logger Oficial:** Utilizar exclusivamente el `Logger` nativo de `@nestjs/common` o un adaptador estructurado (Pino / Winston). Prohibido terminantemente el uso de `console.log` o `console.error`.
* **Contextualización:** Asignar siempre el nombre de la clase como contexto del logger:
  ```typescript
  private readonly logger = new Logger(UsersService.name);
  ```
* **Niveles de Severidad:**
  * **`log` / `info`:** Ciclos de vida del sistema, inicialización de módulos y eventos de negocio clave.
  * **`warn`:** Condiciones anómalas recuperables o advertencias de degradación de servicio.
  * **`error`:** Excepciones no controladas, fallos de conexión externa y eventos críticos (incluir siempre el error y el `trace`).
  * **`debug`:** Trazas detalladas de depuración (activadas únicamente en desarrollo o staging).

---

## 4. Validación de Payloads y DTOs

* **Validación Declarativa:** Todas las entradas deben validarse mediante decoradores de `class-validator` y transformarse con `class-transformer` a nivel de DTO.
* **Configuración del `ValidationPipe` Global:** Activar obligatoriamente el filtrado y rechazo estricto de campos no declarados para prevenir ataques de *mass assignment*:
  ```typescript
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // Elimina propiedades no decoradas en el DTO
      forbidNonWhitelisted: true,   // Lanza error 400 si se envían propiedades no permitidas
      transform: true,              // Transforma payloads a instancias de clase DTO
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );
  ```