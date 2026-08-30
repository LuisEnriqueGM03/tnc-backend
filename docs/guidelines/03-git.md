# 03 — Git y Flujo de Trabajo

Directrices de control de versiones, estrategia de ramas, integración continua y políticas de seguridad para el proyecto **TNC DiscordGang**.

---

## 1. Convención de Mensajes de Commit

Se adopta el estándar **[Conventional Commits](https://www.conventionalcommits.org/)**. El idioma obligatorio para los mensajes es **español** para mantener consistencia y trazabilidad en el equipo.

### Estructura del Commit

```text
<tipo>(<alcance opcional>): <descripción corta en imperativo>

[cuerpo opcional: detalles del contexto y decisiones técnicas]

[pie opcional: referencias a tickets, breaking changes o notas de cierre]
```

### Tipos Permitidos

| Tipo | Propósito | Ejemplo |
|---|---|---|
| `feat` | Nueva funcionalidad o comando | `feat(bot): añadir comando !saludar con respuesta enriquecida` |
| `fix` | Corrección de un error en producción/desarrollo | `fix(gateway): corregir reconexión por timeout en Discord client` |
| `refactor` | Refactorización de código sin alterar comportamiento | `refactor(auth): desacoplar lógica de validación a un custom pipe` |
| `perf` | Mejora medible de rendimiento | `perf(roles): optimizar consulta de caché de permisos y roles` |
| `chore` | Mantenimiento, dependencias, build o scripts | `chore(deps): actualizar dependencias de @nestjs/core` |
| `docs` | Cambios exclusivos en documentación | `docs(readme): actualizar guía de despliegue y variables de entorno` |
| `test` | Añadir, corregir o actualizar pruebas | `test(users): implementar pruebas unitarias para UsersService` |
| `ci` | Configuración de pipelines y flujos de CI/CD | `ci(github): agregar job de validación de lint y pruebas` |

---

## 2. Estrategia de Ramas (*Branching Model*)

El proyecto sigue una adaptación estructurada de **Git Flow**:

```text
main (producción / tags de release)
  ▲
  │ (merge vía PR / hotfix)
develop (integración continua / staging)
  ▲
  ├─ feat/<nombre-descriptivo>
  ├─ fix/<nombre-descriptivo>
  └─ refactor/<nombre-descriptivo>
```

### Nomenclatura y Propósito de Ramas

* **`main`**: Código estable y listo para producción. Protegida contra pushes directos; solo recibe integraciones mediante Pull Requests aprobados desde `develop` (releases) o `hotfix/*`.
* **`develop`**: Rama base de desarrollo e integración continua.
* **`feat/<kebab-case>`**: Nuevas características o módulos. Se ramifica y fusiona contra `develop`.  
  *Ejemplo:* `feat/comando-musica`, `feat/logs-auditoria`
* **`fix/<kebab-case>`**: Corrección de bugs detectados en `develop`.  
  *Ejemplo:* `fix/permiso-canal-voz`
* **`hotfix/<kebab-case>`**: Correcciones críticas urgentes detectadas directamente en `main`. Se ramifica desde `main` y, tras resolverse, se fusiona tanto en `main` como en `develop`.  
  *Ejemplo:* `hotfix/discord-token-leak-invalidation`

---

## 3. Políticas de Pull Requests (PR) y Revisiones

1. **Destino de Integración:**
    * Features y fixes regulares $
      ightarrow$ `develop`.
    * Hotfixes urgentes de producción $
      ightarrow$ `main`.
2. **Criterios de Aceptación (DoD):**
    * El código debe compilar limpiamente sin errores de TypeScript (`npm run build`).
    * Pasar linters y formateadores sin advertencias (`npm run lint`, `npm run format`).
    * Suite de pruebas unitarias/e2e en estado verde (`npm test`).
    * No introducir deuda técnica sin ticket asociado (`TODO: [ID]`).
3. **Estrategia de Fusión:**
    * **Squash and Merge:** Obligatorio para ramas `feat/*` y `fix/*` hacia `develop`, garantizando un historial lineal y limpio.
    * **Merge Commit:** Permitido únicamente para releases formales de `develop` hacia `main` preservando el hito histórico.

---

## 4. Seguridad, Secretos y Control de Exclusiones

* **Cero Secretos en Repositorio:** Está terminantemente prohibido versionar tokens de Discord, API Keys, certificados privados, credenciales de base de datos o cadenas de conexión.
* **Manejo de Variables de Entorno:** Emplear siempre `.env.example` con claves descriptivas vacías para guiar nuevas configuraciones locales.
* **Políticas de `.gitignore`:** Todo entorno local debe ignorar como mínimo:
  ```gitignore
  # Dependencias y artefactos de compilación
  node_modules/
  dist/
  coverage/
  *.tsbuildinfo

  # Variables de entorno y secretos
  .env
  .env.*.local
  *.pem
  *.key

  # Logs y depuración
  *.log
  npm-debug.log*

  # IDEs y SO
  .idea/
  *.iml
  .vscode/
  .DS_Store
  Thumbs.db
  ```

---

## 5. Reglas Operativas para Asistentes y Automatización (Kilo)

1. **Sin Commits Automáticos:** No ejecutar `git commit` ni `git push` a menos que sea solicitado explícitamente por el usuario.
2. **Revisión de Cambios:** Presentar siempre un `git status` / resumen de archivos modificados antes de proponer operaciones sobre el árbol de Git.
3. **Validación Preventiva:** Verificar que ningún archivo con información sensible esté en el *staging area* (`git add`) antes de confirmar cualquier commit.