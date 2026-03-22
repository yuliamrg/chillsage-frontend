# Chillsage Frontend

Frontend administrativo de Chillsage construido con Angular 17 y maquetado sobre AdminLTE. El proyecto ya consume el backend aliado `../chillsage-backend`, incorpora autenticacion con JWT, autorizacion por rol y una base inicial de pruebas automatizadas para la capa de auth.

## Resumen

- Framework: Angular 17 con `standalone components`
- Enrutamiento: `@angular/router` con lazy loading por feature
- UI base: AdminLTE + Bootstrap + Font Awesome desde `src/assets`
- Integracion API: capa HTTP centralizada en `src/app/core/api/`
- Auth: login en `/login`, sesion persistida en `localStorage`, Bearer token por interceptor
- Autorizacion: guards por autenticacion y permisos por rol en rutas y UI
- Pruebas: Karma + Jasmine con cobertura inicial de auth, guards e interceptor
- Idioma predominante de la UI: espanol

## Stack tecnico

### Dependencias principales

- `@angular/*` `17.3.x`
- `rxjs` `7.8.x`
- `zone.js` `0.14.x`

### Tooling

- Angular CLI `17.3.7`
- TypeScript `5.4.x`
- Karma + Jasmine para pruebas unitarias

## Como ejecutar

1. Instalar dependencias:

```bash
npm install
```

2. Levantar el servidor de desarrollo:

```bash
npm start
```

3. Abrir:

```text
http://localhost:4200/
```

## Scripts disponibles

- `npm start`: inicia `ng serve`
- `npm run build`: compila la aplicacion
- `npm run watch`: compila en modo desarrollo con watch
- `npm test`: ejecuta pruebas unitarias con Karma

## Integracion con backend

Este frontend consume el backend ubicado en:

- `../chillsage-backend`

Fuente principal del contrato:

- `../chillsage-backend/docs/contracts/FRONTEND_API_SERVICES.md`
- `docs/api-contract.md`

Reglas de trabajo:

- El frontend consume el contrato real del backend; no debe reinventarlo.
- Si backend cambia endpoints, payloads, auth o relaciones enriquecidas, el frontend debe ajustarse en el mismo trabajo.
- Ningun cambio de integracion se considera completo si solo compila frontend o solo backend.

Archivos que normalmente se revisan cuando cambia el contrato:

- `src/app/core/models/domain.models.ts`
- `src/app/core/mappers/domain.mappers.ts`
- `src/app/core/api/*.ts`
- `src/app/core/auth/*.ts`
- pantallas `list`, `detail`, `new` y `edit` del recurso afectado

## Autenticacion y autorizacion

La aplicacion ahora expone una ruta publica:

- `/login`

Todo el resto del panel corre dentro de un layout autenticado y queda protegido por guards.

### Flujo de sesion

- `POST /users/login` autentica al usuario
- la respuesta se mapea a `AuthSession`
- la sesion se persiste en `localStorage`
- el interceptor agrega `Authorization: Bearer <token>` a requests API protegidos
- un `401` fuera de login limpia sesion y redirige a `/login?reason=expired`
- un `403` redirige a `/access-denied`

### Roles soportados

- `admin`: acceso total
- `planeador`: CRUD sobre `clients`, `equipments`, `requests`, `orders`, `schedules`; lectura en `users`, `roles`, `profiles`
- `tecnico`: lectura sobre `clients`, `equipments`, `requests`, `orders`, `schedules`
- `solicitante`: lectura sobre `requests` y `orders`, creacion de `requests`

### Piezas principales

- `src/app/core/auth/auth.service.ts`
- `src/app/core/auth/auth.interceptor.ts`
- `src/app/core/auth/auth.guard.ts`
- `src/app/core/auth/guest.guard.ts`
- `src/app/core/auth/permission.guard.ts`
- `src/app/features/auth/login/`
- `src/app/layout/authenticated-layout/`
- `src/app/layout/access-denied/`

## Arquitectura actual

La aplicacion usa dos shells:

- shell publico para `/login`
- shell autenticado con `HeaderComponent`, `SidebarComponent`, `FooterComponent` y `RouterOutlet`

El enrutamiento principal vive en `src/app/app.routes.ts`. Cada dominio carga sus rutas mediante `loadChildren`, y esas rutas pueden declarar `requiredRoles` o `requiredPermission` para ser evaluados por `permissionGuard`.

### Estructura de carpetas

```text
src/
  app/
    core/
      api/
      auth/
      mappers/
      models/
    features/
      auth/
      dashboard/
      schedule/
      equipment/
      orders/
      requests/
      users/
      client/
    layout/
      authenticated-layout/
      access-denied/
      header/
      sidebar/
      footer/
      not-found/
```

## Testing

La base de pruebas actual cubre la capa de autenticacion:

- `auth.service.spec.ts`
- `auth.guard.spec.ts`
- `guest.guard.spec.ts`
- `permission.guard.spec.ts`
- `auth.interceptor.spec.ts`

Validacion minima esperada para cambios funcionales:

```bash
npm test -- --watch=false --browsers=ChromeHeadless
npm run build
```

Adicionalmente, el repo incluye una skill local para ayudar a crear pruebas nuevas:

- `.agents/chillsage-test-writer/`

## Workflow de Git

El flujo recomendado para ramas, commits y validaciones se documenta en:

- `docs/git-workflow.md`

Resumen practico:

1. crear una rama `feat/*`, `fix/*`, `docs/*`, etc.
2. trabajar en cambios pequenos y coherentes
3. validar con `build` y, si aplica, `test`
4. hacer commit con Conventional Commits

## Archivos clave

- `package.json`: dependencias y scripts
- `angular.json`: configuracion de build y assets globales
- `docs/api-contract.md`: contrato consumido por el frontend
- `docs/git-workflow.md`: flujo recomendado de ramas y commits
- `src/app/app.config.ts`: providers globales
- `src/app/app.routes.ts`: routing principal
- `src/app/core/auth/`: autenticacion, autorizacion y pruebas
- `src/app/layout/sidebar/sidebar.component.html`: navegacion principal filtrada por permisos

## Verificacion reciente

Sobre el estado actual se ejecutaron:

```bash
npm test -- --watch=false --browsers=ChromeHeadless
npm run build
```

Resultado:

- la suite de pruebas pasa
- la aplicacion compila correctamente

## Conclusión

Chillsage Frontend ya no debe tratarse como un prototipo visual aislado. Hoy tiene integracion real con backend, control de acceso por rol y una base de pruebas sobre la capa de auth. La siguiente fase razonable es ampliar cobertura hacia CRUDs, estados de carga/error y flujos completos por feature.
