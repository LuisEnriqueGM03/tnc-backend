-- Crea el usuario de aplicación y la base de datos para desarrollo local.
-- Ejecutar como superusuario postgres:
--   "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -f scripts/setup-database.sql
-- Nota: reemplazar 'cambiar-esta-contrasena' por una segura y dejarla igual en .env (DATABASE_PASSWORD).

CREATE ROLE tnc_app WITH LOGIN PASSWORD 'cambiar-esta-contrasena';

CREATE DATABASE tnc_discordgang
    WITH OWNER = tnc_app
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Spain.1252'
    LC_CTYPE = 'Spanish_Spain.1252'
    TEMPLATE = template0;

GRANT ALL PRIVILEGES ON DATABASE tnc_discordgang TO tnc_app;
