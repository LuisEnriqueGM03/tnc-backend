# AGENTS.md — TNC DiscordGang Backend

Directrices de desarrollo, reglas de ejecución y directivas de comportamiento para **Kilo** (y cualquier agente de IA) que opere en este repositorio.

---

## 1. Misión y Alcance del Proyecto

Desarrollo del backend robusto, escalable y mantenible para el bot **TNC DiscordGang**, implementado en **NestJS** y **TypeScript** con arquitectura limpia y desacoplada.

* **Estado actual:** Fase inicial / scaffold de arquitectura.
* **Idioma oficial:** Todo el código fuente, commits, documentación y respuestas técnicas deben mantenerse en **español** para alineación con el equipo.

---

## 2. Índice de Directrices Obligatorias

Antes de realizar cambios o generar código, consulta y adhiérete estrictamente a las especificaciones contenidas en `docs/guidelines/`:

| Módulo de Directriz | Ruta de Referencia | Alcance |
|---|---|---|
| **Arquitectura y Estructura** | [`docs/guidelines/01-structure.md`](docs/guidelines/01-structure.md) | Organización de módulos, Clean Architecture / Onion Architecture y separación de capas |
| **Estilo y Formato** | [`docs/guidelines/02-style.md`](docs/guidelines/02-style.md) | TypeScript estricto, DTOs, validación y convenciones de nombres |
| **Git y Flujo de Trabajo** | [`docs/guidelines/03-git.md`](docs/guidelines/03-git.md) | Conventional Commits, ramas, PRs y políticas de Git |
| **Calidad y Observabilidad** | [`docs/guidelines/04-quality.md`](docs/guidelines/04-quality.md) | Jest (Unit/E2E), manejo semántico de excepciones y Logger oficial |
| **Contratos de la API** | [`docs/guidelines/05-api-contracts.md`](docs/guidelines/05-api-contracts.md) | Exposición de endpoints REST, versionado, estandarización de respuestas y documentación OpenAPI |

---

## 3. Reglas Estrictas para Agentes de IA

1. **Tipado Estricto (TypeScript First):**
  * Prohibido el uso de `any`. Emplear `unknown` con *type guards* o genéricos estrictos.
  * Modificadores de acceso explícitos (`private`, `readonly`, `public`) e interfaces claras para contratos e inyección de dependencias.
2. **Control de Versiones y Cambios:**
  * **No ejecutar `git commit` ni `git push`** de forma autónoma. Solo realizar operaciones de commit cuando el usuario lo instruya explícitamente.
  * No dejar dependencias rotas ni archivos temporales.
3. **Cero Tolerancia a Filtración de Secretos:**
  * **Nunca** hardcodear tokens de Discord, API Keys, cadenas de conexión a bases de datos ni certificados.
  * Utilizar siempre variables de entorno inyectadas mediante `@nestjs/config` y documentadas en `.env.example`.
4. **Comentarios de Código:**
  * No escribir comentarios obvios que describan *qué* hace el código.
  * Reservar comentarios exclusivamente para documentar el **por qué** de una decisión de arquitectura o una restricción de la API externa.
5. **Criterios de Finalización de Tarea (Definition of Done):**
  * Toda solución generada debe compilar y validar mediante:
    ```bash
    npm run format
    npm run lint
    npm run test
    ```

---

## 4. Stack Tecnológico Base (TypeScript / Node.js)

```typescript
export interface TechStackDefinition {
  readonly runtime: 'Node.js LTS';
  readonly framework: '@nestjs/core ^11.x';
  readonly language: 'TypeScript (strict: true)';
  readonly validation: 'class-validator' | 'class-transformer';
  readonly configuration: '@nestjs/config' | 'joi';
  readonly testing: 'Jest' | 'Supertest';
}
```