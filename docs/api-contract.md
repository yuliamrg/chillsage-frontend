# Contrato API Consumido por el Frontend

Este documento resume el contrato que el frontend consume desde `../chill-sage-backend`. Complementa la documentacion del backend, pero no la reemplaza.

## Fuente de verdad

- `../chill-sage-backend/docs/contracts/FRONTEND_API_SERVICES.md`
- `../chill-sage-backend/docs/contracts/auth-and-conventions.md`
- `../chill-sage-backend/docs/contracts/resources/users.md`

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
- `username` solo se conserva como compatibilidad legacy del backend
- la respuesta se transforma a `AuthSession`
- la sesion se persiste en `localStorage`
- el interceptor agrega `Authorization: Bearer <token>` a requests API protegidas
- `/users/login` queda excluido del Bearer

Manejo de errores implementado:

- `401` fuera de login: limpia sesion y redirige a `/login?reason=expired`
- `403` fuera de login: se normaliza como falta de permiso o filtro fuera de cobertura
- `404` en detalle puede representar recurso fuera de cobertura
- `429` en login debe tratarse como rate limiting esperado
- errores `5xx`: se normalizan con un mensaje generico para UI

## Roles y permisos

Roles reconocidos por id o nombre:

- `1`: `admin_plataforma`
- `2`: `solicitante`
- `3`: `planeador`
- `4`: `tecnico`
- `5`: `admin_cliente`

La sesion autenticada ya no se modela con un solo cliente. El frontend persiste y consume:

- `role_name`
- `primary_client_id`
- `primary_client_name`
- `client_ids`
- `all_clients`
- `clients`

Cobertura vigente:

- `admin_plataforma` tiene acceso global
- `admin_cliente`, `planeador`, `tecnico` y `solicitante` operan con cobertura por cliente
- si `all_clients=false`, la cobertura efectiva son los `client_ids`
- si una accion crea un recurso sin `client_id`, el backend usa `primary_client_id`
- si no existe `primary_client_id` valido, el backend puede responder `400`

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

- `admin_plataforma`: CRUD total sobre todos los recursos; en `requests`, `orders` y `schedules` tambien incluye acciones operativas
- `admin_cliente`: administra usuarios y recursos dentro de su cobertura; no debe gestionar `admin_plataforma`
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

## Users

El recurso `users` debe modelarse y renderizarse con cobertura multi-cliente:

- lectura: `primary_client_id`, `primary_client_name`, `client_ids`, `all_clients`, `clients`
- create y edit: `role`, `primary_client_id`, `client_ids`, `all_clients`, `status`
- `admin_cliente` no puede ver, crear ni editar `admin_plataforma`
- `planeador` conserva lectura; create, edit y delete quedan ocultos para el resto

## Cobertura y UX

Reglas que el frontend ya debe asumir:

- un detalle fuera de cobertura puede responder `404`
- un filtro `client_id` fuera de cobertura puede responder `403`
- si el usuario no tiene `all_clients`, no deben mostrarse selectores globales de clientes
- requests, orders, schedules y equipment deben limitar filtros y opciones a la cobertura efectiva
- los mensajes de `403` y `404` ya no deben tratarse como bug por defecto

## Archivos que deben actualizarse cuando cambia el contrato

- `src/app/core/models/domain.models.ts`
- `src/app/core/mappers/domain.mappers.ts`
- `src/app/core/api/`
- `src/app/core/auth/` si cambia login, token o permisos
- pantallas `list`, `detail`, `create` y `edit` del recurso afectado

## Checklist de sincronizacion

1. Revisar endpoints, payloads y codigos de error en `../chill-sage-backend/docs/contracts/`.
2. Actualizar este documento si el frontend ya consume un contrato distinto.
3. Ajustar modelos, mappers y servicios.
4. Ajustar guards o permisos si cambia auth/autorizacion.
5. Actualizar pruebas afectadas.
6. Ejecutar:

```bash
pnpm run test:headless
pnpm run build
```
