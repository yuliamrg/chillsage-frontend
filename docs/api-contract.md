# Contrato API Vigente para Chillsage Frontend

Este documento resume el contrato que el frontend consume actualmente desde `../chillsage-backend`. Complementa, pero no reemplaza, la documentacion oficial del backend.

## Fuente de verdad

- `../chillsage-backend/docs/contracts/FRONTEND_API_SERVICES.md`
- `../chillsage-backend/docs/CODEX_CONTEXT.md`

Si hay divergencia entre este archivo y el backend, prevalece el backend.

## Base URL

```text
http://localhost:3037/api
```

## Autenticacion

### Endpoint publico

```text
POST /users/login
```

Payload esperado:

```json
{
  "email": "admin@example.com",
  "password": "secret"
}
```

El backend tambien puede aceptar `username`, pero la UI actual usa `email + password`.

Respuesta esperada:

```json
{
  "status": true,
  "msg": "Login exitoso",
  "access_token": "jwt-token",
  "token_type": "Bearer",
  "expires_in": "3600",
  "user": {
    "id": 1,
    "username": "admin",
    "name": "Ada",
    "last_name": "Admin",
    "email": "admin@example.com",
    "client": null,
    "client_name": null,
    "role": 1,
    "role_name": "admin",
    "status": "active"
  }
}
```

### Sesion en frontend

- la respuesta se transforma a `AuthSession`
- la sesion se guarda en `localStorage`
- el interceptor agrega `Authorization: Bearer <token>` a toda request API protegida
- `/users/login` queda excluido del Bearer

### Manejo de errores

- `401` fuera de login: limpiar sesion y redirigir a `/login?reason=expired`
- `403` fuera de login: redirigir a `/access-denied`

## Roles y permisos consumidos por el frontend

Roles reconocidos por id o nombre:

- `1`: `admin`
- `2`: `solicitante`
- `3`: `planeador`
- `4`: `tecnico`

Matriz de permisos aplicada en UI y rutas:

- `admin`: CRUD total sobre todos los recursos
- `planeador`: CRUD en `clients`, `equipments`, `requests`, `orders`, `schedules`; lectura en `users`, `roles`, `profiles`
- `tecnico`: lectura en `clients`, `equipments`, `requests`, `orders`, `schedules`
- `solicitante`: lectura en `requests` y `orders`; creacion en `requests`

Recursos modelados en frontend:

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

## Rutas frontend relacionadas con auth

- `/login`: publica
- `/access-denied`: publica
- resto del panel: protegido por `authGuard` o `authChildGuard`

Las rutas por feature pueden declarar:

- `data.requiredRoles`
- `data.requiredPermission`

## Recursos consumidos actualmente

El frontend ya tiene capa API y mappers para:

- `users`
- `roles`
- `clients`
- `equipments`
- `requests`
- `orders`
- `schedules`

Cada cambio de contrato debe revisarse al menos en:

- `src/app/core/models/domain.models.ts`
- `src/app/core/mappers/domain.mappers.ts`
- `src/app/core/api/`
- `src/app/core/auth/` si el cambio afecta login, token o autorizacion
- componentes `list`, `detail`, `new`, `edit` del feature afectado

## Checklist de sincronizacion con backend

1. Revisar endpoint, payload y codigos de error vigentes en `../chillsage-backend`.
2. Actualizar modelos y mappers si cambia el shape de datos.
3. Ajustar servicios o wrappers API si cambia endpoint, metodo o envoltura de respuesta.
4. Ajustar guards, permisos o UI si cambia el esquema de auth/autorizacion.
5. Actualizar pruebas afectadas.
6. Ejecutar:

```bash
npm test -- --watch=false --browsers=ChromeHeadless
npm run build
```

## Cobertura automatizada relacionada

La capa de auth actualmente tiene pruebas en:

- `src/app/core/auth/auth.service.spec.ts`
- `src/app/core/auth/auth.guard.spec.ts`
- `src/app/core/auth/guest.guard.spec.ts`
- `src/app/core/auth/permission.guard.spec.ts`
- `src/app/core/auth/auth.interceptor.spec.ts`

## Nota practica

Este documento ya no es un contrato inferido de pantallas mock. Refleja el contrato usado por la implementacion vigente del frontend, especialmente en login, JWT y autorizacion por rol.
