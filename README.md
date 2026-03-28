# Chillsage Frontend

Frontend administrativo de Chillsage construido con Angular 17. Consume el backend aliado `../chillsage-backend`, usa autenticacion con JWT, permisos por rol y una UI basada en AdminLTE.

## Resumen

- Angular 17 con `standalone components`
- Lazy loading por feature con `@angular/router`
- Capa HTTP compartida en `src/app/core/api/`
- Login en `/login` y panel autenticado para el resto del sistema
- Guards de autenticacion y permisos en rutas y UI
- Karma + Jasmine para pruebas unitarias
- UI en espanol

## Estructura

```text
src/app/
  core/       servicios, auth, modelos, mappers y utilidades
  features/   dashboard, auth, users, requests, orders, equipment, schedule, client
  layout/     shells y piezas compartidas del panel
docs/         contrato API y flujo de trabajo Git
scripts/      utilidades locales para pruebas headless
```

## Puesta en marcha

1. Instalar dependencias:

```bash
pnpm install
```

2. Levantar el servidor de desarrollo:

```bash
pnpm start
```

3. Abrir `http://localhost:4200/`.

## Scripts utiles

- `pnpm start`: inicia `ng serve`
- `pnpm run build`: genera el build de produccion
- `pnpm run watch`: recompila en modo desarrollo
- `pnpm test`: ejecuta Karma en modo watch
- `pnpm run test:headless`: corre Karma en `ChromeHeadlessCI`
- `pnpm run browser:install`: descarga un Chrome local en `.cache/puppeteer`

## Backend y contrato

El frontend consume `../chillsage-backend`. La fuente de verdad del contrato sigue estando en el backend; este repo solo documenta el consumo desde frontend.

- Contrato resumido del frontend: `docs/api-contract.md`
- Flujo de ramas y commits: `docs/git-workflow.md`

Puntos operativos vigentes en código:

- fallback local de API: `http://localhost:3037/api`
- override runtime: `window.__CHILLSAGE_API_BASE_URL__`
- `401` fuera de login: limpia sesion y redirige a `/login?reason=expired`
- `403` fuera de login: redirige a `/access-denied`
- las requests API agregan `X-Request-Id`

## Validacion recomendada

Para cambios funcionales o de integracion:

```bash
pnpm run test:headless
pnpm run build
```

## Archivos clave

- `package.json`
- `angular.json`
- `src/app/app.routes.ts`
- `src/app/core/api/`
- `src/app/core/auth/`
- `src/app/core/models/domain.models.ts`
- `src/app/core/mappers/domain.mappers.ts`
- `docs/api-contract.md`
- `docs/git-workflow.md`
