# 02 — Estándares de Estilo y Calidad de Código

Directrices de desarrollo, tipado estricto y convenciones de arquitectura para el ecosistema NestJS / TypeScript.

---

## 1. Tipado y TypeScript

* **Configuración Estricta:** Mantener siempre `"strict": true` y `"noImplicitAny": true` en `tsconfig.json`.
* **Prohibición de `any`:** El uso de `any` está vetado. Si la estructura de datos es indeterminada en tiempo de compilación, utilizar `unknown` junto con *type narrowing* (guardas de tipo).
* **Firmas de Métodos:**
  * **Públicos / Exportados:** Declaración obligatoria y explícita del tipo de retorno (ej. `Promise<UserEntity>`).
  * **Privados / Internos:** Inferencia automática de tipos permitida únicamente si la legibilidad no se ve comprometida.
* **Inmutabilidad:** Emplear `readonly` en propiedades inyectadas por constructor (servicios, repositorios) y en interfaces de dominio.

---

## 2. Convenciones de Nomenclatura (*Naming Conventions*)

| Elemento | Convención | Formato / Sufijo | Ejemplo |
|---|---|---|---|
| **Variables, métodos, funciones** | `camelCase` | Verbo + sustantivo para métodos | `findUserById()`, `isActive` |
| **Clases, Módulos, Controladores** | `PascalCase` | Nombre de dominio + tipo de artefacto | `UsersController`, `AuthService` |
| **Interfaces de Dominio** | `PascalCase` | Sin prefijo `I` innecesario (salvo contratos de infraestructura) | `User`, `UserRepository` |
| **Constantes Globales / Config** | `UPPER_SNAKE_CASE` | Valores primitivos inmutables | `MAX_RETRY_ATTEMPTS`, `JWT_EXPIRES_IN` |
| **Archivos y Directorios** | `kebab-case` | `[nombre].[tipo].ts` | `create-user.dto.ts`, `users/` |
| **Enums** | `PascalCase` / `UPPER_SNAKE` | Miembros en mayúsculas | `enum OrderStatus { PENDING, DELIVERED }` |

---

## 3. Formato, Linting y Automatización

* **Prettier & ESLint:** El código debe adherirse al estándar oficial `@nestjs/eslint-plugin` y `.prettierrc` del proyecto.
* **Integridad de Reglas:** Prohibido desactivar reglas de linter (`// eslint-disable`) sin una justificación técnica documentada en la misma línea.
* **Git Hooks (Husky/lint-staged):** El formato (`npm run format`) y análisis estático (`npm run lint`) deben pasar limpiamente antes de cada commit.

---

## 4. DTOs, Entidades y Validación de Capa

* **Estructura de DTOs:** Clases TypeScript puras que utilizan exclusivamente `class-validator` y `class-transformer`. No incluir lógica de negocio ni métodos ejecutables.
* **Inmutabilidad de Entrada:** Emplear modificadores `readonly` en los campos del DTO.
* **Pipeline de Validación:** Centralizar la validación en el `ValidationPipe` global con `{ whitelist: true, forbidNonWhitelisted: true, transform: true }`. Prohibida la validación manual dentro de los controladores.
* **Documentación OpenAPI:** Todo campo de DTO expuesto externamente debe contener el decorador `@ApiProperty()` de `@nestjs/swagger` con tipos y descripciones claras.

---

## 5. Documentación y Deuda Técnica

* **Código Autoexplicativo:** El código limpio sustituye a los comentarios redundantes. No escribir comentarios que describan *qué* hace una instrucción simple.
* **Criterio de Documentación:** Los comentarios (JSDoc o inline) se reservan exclusivamente para:
  * Explicar el **por qué** (*contexto de negocio, workarounds temporales o restricciones técnicas*).
  * Advertir sobre efectos secundarios no evidentes o impacto en el rendimiento.
* **Marcadores de Deuda:** Utilizar `// TODO: [TICKET-ID] Descripción` para tareas pendientes vinculadas a una incidencia formal.