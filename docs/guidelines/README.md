# Directrices de Desarrollo y Arquitectura — TNC DiscordGang Backend

Este directorio centraliza los estándares técnicos, patrones de diseño y normas operativas obligatorias para cualquier desarrollador o agente de IA (**Kilo**) que contribuya en este repositorio. El punto de entrada principal está sincronizado con el archivo [`AGENTS.md`](../../AGENTS.md) ubicado en la raíz del proyecto.

---

## 1. Convenciones de Nomenclatura y Versionado de Guías

* **Estructura de Archivos:** Todo documento dentro de este directorio debe seguir el formato `NN-tema.md`.
* **Prefijo Secuencial:** `NN` corresponde a dos dígitos incrementales (`01`, `02`, `03`, ...).
* **Idioma y Formato:** Nombres estrictamente en **español** y utilizando formato **kebab-case** (ej. `06-base-de-datos.md`).

---

## 2. Índice de Módulos Técnicos

| Documento | Alcance y Contenido Principal |
|---|---|
| [`01-structure.md`](01-structure.md) | Arquitectura modular, Clean / Onion Architecture y separación estricta de capas en NestJS. |
| [`02-style.md`](02-style.md) | Estándares de TypeScript estricto, formato, reglas de ESLint/Prettier y convenciones de *naming*. |
| [`03-git.md`](03-git.md) | Estrategia de ramas (Git Flow), Conventional Commits en español y políticas de Pull Request. |
| [`04-quality.md`](04-quality.md) | Estrategia de testing (Jest / Supertest), filtros globales de excepción, logging estructurado y validación de DTOs. |
| [`05-api-contracts.md`](05-api-contracts.md) | Exposición de endpoints REST, versionado, estandarización de respuestas y documentación OpenAPI |

---

## 3. Protocolo de Modificación y Extensión

1. **Adición de Nuevas Normas:** Al introducir una directriz nueva (ej. bases de datos, colas de mensajería o caché), asigne el correlativo numérico inmediato superior (`06-*.md`).
2. **Sincronización Bidireccional:** Todo cambio estructural o adición de directrices debe actualizar de forma obligatoria tanto la tabla de este archivo como la sección de referencias en el `AGENTS.md` raíz.
3. **Revisión de Impacto:** Las modificaciones a estándares existentes deben validarse para garantizar que el código ya generado continúe cumpliendo con el *Definition of Done* del proyecto.