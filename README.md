# EV3.Luis.Hernandez — Sistema de Gestión de Proyectos

Aplicación web con **Next.js 16**, **TypeScript**, **Tailwind CSS**, **Prisma/MySQL**, autenticación **JWT** y hash de contraseñas **Argon2id**.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19, Tailwind CSS 4 |
| Backend / API | Next.js Route Handlers |
| ORM | Prisma |
| Base de datos | MySQL 9.7 |
| Autenticación | JWT (`Authorization: Bearer <token>`) |
| Contraseñas | Argon2id (`@node-rs/argon2`) |
| Validación | Zod |
| Contenedores | Docker Compose |
| Gestor JS | pnpm (dentro del contenedor) |

## Requisitos

- Docker Desktop
- Puertos libres: `3000` (app) y `3307` (MySQL en el host, configurable)

## Variables de entorno

Copia `.env.example` a `.env`. Valores según el brief:

| Variable | Descripción |
|---|---|
| `DB_NAME` | `desarrollo_software_1` |
| `DB_USER` | `root` |
| `DB_PASSWORD` | `desarrollo_software_1` |
| `DATABASE_URL` | Conexión Prisma (host `mysql` dentro de Docker) |
| `JWT_SECRET` | Secreto para firmar tokens |
| `JWT_EXPIRES_IN` | Ej.: `1h` |
| `APP_PORT` | Puerto de la app en el host (default `3000`) |
| `MYSQL_PUBLISH_PORT` | Puerto MySQL en el host (default `3307`) |

Dentro de Docker, `DATABASE_URL` usa el hostname `mysql`. Desde Windows (cliente externo) usa `127.0.0.1` y el puerto publicado.

## Arranque

```bash
docker compose up --build -d
```

| Servicio | Contenedor | URL / acceso |
|---|---|---|
| App | `eval3-app` | http://localhost:3000 |
| MySQL | `eval3-mysql` | `127.0.0.1:3307` (según `.env`) |

Al iniciar, el contenedor ejecuta `pnpm install`, `prisma generate`, `prisma db push` y `next dev`.

## Modelos

### Usuario

`id`, `nombre`, `correo` (único), `clave` (hash Argon2id)

### Proyecto

`id`, `nombre`, `fecha_inicio`, `estado`, `responsable`, `monto` (entero CLP), `created_by`

## API — Autenticación

| Método | Ruta | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/register`  Registro de usuario |
| `POST` | `/api/auth/login`  Login; devuelve JWT |

## API — Proyectos

Todas las rutas de proyectos requieren header:

```
Authorization: Bearer <token>
```

| Método | Ruta | Código | Respuesta |
|---|---|---|---|
| `POST` | `/api/proyectos` | `201` | Objeto proyecto (todos los campos) |
| `GET` | `/api/proyectos` | `200` | Arreglo `[...]` (vacío `[]` si no hay datos) |
| `GET` | `/api/proyectos/:id` | `200` / `404` | Objeto proyecto o error |
| `PUT` | `/api/proyectos/:id` | `200` / `404` | Objeto actualizado |
| `PATCH` | `/api/proyectos/:id` | `200` / `404` | Igual que PUT |
| `DELETE` | `/api/proyectos/:id` | `204` / `404` | Sin cuerpo |

Campos en respuestas JSON:

```json
{
  "id": 1,
  "nombre": "Portal web",
  "fecha_inicio": "2026-03-01",
  "estado": "Planificado",
  "responsable": "Ana López",
  "monto": 1500000,
  "created_by": 2
}
```

`POST`, `PUT` y `PATCH` exigen todos los campos requeridos y no vacíos (validación Zod). Solo el creador puede editar o eliminar su proyecto (`403`).

## Vistas

| Ruta | Descripción |
|---|---|
| `/login` | Inicio de sesión (correo, clave) |
| `/registro` | Registro (nombre, correo, clave) |
| `/dashboard` | Panel con resumen de proyectos |
| `/proyectos` | CRUD de proyectos (tabla, modales) |

## Por qué este stack?

Elegí este stack para actualizarme; vengo de utilizar PHP/Laravel, JS y CSS/HTML. En los últimos meses trabajo con Tailwind, pero necesitaba actualizarme y buscar soluciones a problemáticas que encontraba con ese stack, como el costo extra de cPanel o Plesk en servidores compartidos (PHP con Docker suele ir más lento en esos entornos).

También, para el entorno laboral, veo que este stack se utiliza más y hay más mercado. PHP no desaparece, pero muchos proyectos nuevos ya no lo usan; lo que queda en muchos casos es código legacy.

