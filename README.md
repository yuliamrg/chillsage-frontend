# Chillsage Frontend

Frontend administrativo de Chillsage construido con Angular 17. Consume el backend hermano `../chill-sage-backend` y hoy trabaja con autenticacion Bearer, permisos por rol y cobertura multi-cliente.

## Resumen operativo

- Angular 17 con `standalone components`
- Routing lazy por feature con `@angular/router`
- Capa compartida en `src/app/core/` para API, auth, modelos y mappers
- UI administrativa basada en AdminLTE
- Login en `/login` y panel autenticado para el resto del sistema
- Pruebas unitarias con Karma + Jasmine

## Estructura

```text
src/app/
  core/       API, auth, modelos, mappers y servicios compartidos
  features/   dashboard, users, requests, orders, equipment, schedule y client
  layout/     layout autenticado y piezas de navegacion
docs/         contrato consumido y flujo Git del repo
scripts/      utilidades para pruebas headless
```

## Puesta en marcha

```bash
pnpm install
pnpm start
```

La app queda disponible en `http://localhost:4200/`.

## Scripts utiles

- `pnpm start`: inicia `ng serve`
- `pnpm run build`: genera el build de produccion
- `pnpm run watch`: recompila en modo desarrollo
- `pnpm test`: ejecuta Karma en modo watch
- `pnpm run test:headless`: corre Karma una vez con `ChromeHeadlessCI`
- `pnpm run browser:install`: instala un Chrome local en `.cache/puppeteer`

## Backend y contrato

La fuente de verdad del contrato vive en `../chill-sage-backend/docs/contracts/`. Este repo solo documenta el consumo vigente desde frontend.

- Resumen de consumo frontend: `docs/api-contract.md`
- Flujo Git del repo: `docs/git-workflow.md`

Puntos operativos vigentes en código:

- fallback local de API: `http://localhost:3037/api`
- override runtime: `window.__CHILLSAGE_API_BASE_URL__`
- sesion persistida en `localStorage`
- auth modelada con `role_name`, `primary_client_id`, `primary_client_name`, `client_ids`, `all_clients` y `clients`
- `401` fuera de login: limpia sesion y redirige a `/login?reason=expired`
- `403` fuera de login: se trata como falta de permiso o filtro fuera de cobertura
- `404` puede significar detalle fuera de cobertura
- las requests API agregan y propagan `X-Request-Id`

## Validacion minima

```bash
pnpm run test:headless
pnpm run build
```

## Archivos clave

- `package.json`
- `src/app/app.routes.ts`
- `src/app/core/api/`
- `src/app/core/auth/`
- `src/app/core/models/domain.models.ts`
- `src/app/core/mappers/domain.mappers.ts`
- `docs/api-contract.md`
