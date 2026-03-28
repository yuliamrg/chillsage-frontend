# Contrato API Consumido por el Frontend

Este documento resume el contrato que el frontend consume desde `../chillsage-backend`. Complementa la documentacion del backend, pero no la reemplaza.

## Fuente de verdad

- `../chillsage-backend/docs/contracts/FRONTEND_API_SERVICES.md`
- `../chillsage-backend/docs/CODEX_CONTEXT.md`

Si hay divergencia, prevalece el backend.

## Base URL y transporte

- El backend expone la API bajo `http://localhost:<PORT>/api`.
- Este frontend usa `http://localhost:3037/api` como fallback local.
- La base URL puede sobreescribirse en runtime con `window.__CHILLSAGE_API_BASE_URL__`.
- La capa HTTP agrega `X-Request-Id` a cada request API y propaga ese valor cuando llega en errores del backend.

## Autenticacion

Endpoint publico:

```text
POST /users/login
```

Notas vigentes en frontend:

- la UI envia `email` y `password`
- el backend tambien puede aceptar `username`
- la respuesta se transforma a `AuthSession`
- la sesion se persiste en `localStorage`
- el interceptor agrega `Authorization: Bearer <token>` a requests API protegidas
- `/users/login` queda excluido del Bearer

Manejo de errores implementado:

- `401` fuera de login: limpia sesion y redirige a `/login?reason=expired`
- `403` fuera de login: redirige a `/access-denied`
- errores `5xx`: se normalizan con un mensaje generico para UI

## Roles y permisos

Roles reconocidos por id o nombre:

- `1`: `admin`
- `2`: `solicitante`
- `3`: `planeador`
- `4`: `tecnico`

Recursos modelados:

- `users`
- `roles`
- `profiles`
- `clients`
- `equipments`
- `requests`
- `orders`
- `schedules`

Acciones modeladas:

- `read`
- `create`
- `update`
- `delete`
- `approve`
- `cancel`
- `assign`
- `start`
- `complete`
- `open`
- `close`

Permisos vigentes en `src/app/core/auth/auth.permissions.ts`:

- `admin`: CRUD total sobre todos los recursos; en `requests`, `orders` y `schedules` tambien incluye acciones operativas
- `planeador`: lectura en `users`, `roles`, `profiles`; `create`, `read`, `update` en `clients` y `equipments`; gestion operativa de `requests`, `orders` y `schedules` sin `delete`
- `tecnico`: lectura en `clients`, `equipments`, `requests`, `schedules`; en `orders` puede `read`, `start` y `complete`
- `solicitante`: `read` y `create` en `requests`; `read` en `orders`

## Rutas protegidas

Rutas publicas:

- `/login`
- `/access-denied`

El resto del panel usa `authChildGuard`. Las rutas por feature usan `permissionGuard` con:

- `data.requiredRoles`
- `data.requiredPermission`

Features cargadas desde `src/app/app.routes.ts`:

- `dashboard`
- `schedule`
- `equipment`
- `orders`
- `requests`
- `users`
- `client`

## Archivos que deben actualizarse cuando cambia el contrato

- `src/app/core/models/domain.models.ts`
- `src/app/core/mappers/domain.mappers.ts`
- `src/app/core/api/`
- `src/app/core/auth/` si cambia login, token o permisos
- pantallas `list`, `detail`, `create` y `edit` del recurso afectado

## Checklist de sincronizacion

1. Revisar endpoints, payloads y codigos de error en `../chillsage-backend`.
2. Actualizar este documento si el frontend ya consume un contrato distinto.
3. Ajustar modelos, mappers y servicios.
4. Ajustar guards o permisos si cambia auth/autorizacion.
5. Actualizar pruebas afectadas.
6. Ejecutar:

```bash
pnpm run test:headless
pnpm run build
```
