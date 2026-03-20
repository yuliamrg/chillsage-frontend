# Chillsage Frontend

Frontend administrativo construido con Angular 17 y maquetado sobre AdminLTE. El proyecto ya tiene navegación principal, layout base y pantallas por dominio, pero en su estado actual funciona principalmente como prototipo visual con datos estáticos.

## Resumen

- Framework: Angular 17 con `standalone components`
- Enrutamiento: `@angular/router` con lazy loading por feature
- UI base: AdminLTE + Bootstrap + Font Awesome + jQuery cargados desde `src/assets`
- Estado funcional: vistas y navegación disponibles, sin capa de servicios ni consumo de API
- Idioma predominante de la UI: español

## Stack técnico

### Dependencias principales

- `@angular/*` `17.3.x`
- `rxjs` `7.8.x`
- `zone.js` `0.14.x`

### Tooling

- Angular CLI `17.3.7`
- TypeScript `5.4.x`
- Karma + Jasmine para pruebas unitarias

## Cómo ejecutar

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
- `npm run build`: compila la aplicación
- `npm run watch`: compila en modo desarrollo con watch
- `npm test`: ejecuta pruebas unitarias con Karma

## Workflow de Git

El flujo recomendado para ramas, commits y validaciones quedó documentado en:

- `docs/git-workflow.md`

## Arquitectura actual

La aplicación usa un `AppComponent` raíz con layout fijo:

- `HeaderComponent`
- `SidebarComponent`
- `RouterOutlet`
- `FooterComponent`

El enrutamiento principal está definido en `src/app/app.routes.ts` y cada dominio carga sus rutas de forma diferida mediante `loadChildren` o `loadComponent`.

### Estructura de carpetas

```text
src/
  app/
    features/
      dashboard/
      schedule/
      equipment/
      orders/
      requests/
      users/
      client/
    layout/
      header/
      sidebar/
      footer/
      not-found/
```

## Módulos funcionales

### Dashboard

- Ruta: `/dashboard`
- Estado: pantalla básica de bienvenida

### Cronogramas

- Base: `/schedule`
- Rutas:
  - `/schedule/list`
  - `/schedule/new`
  - `/schedule/edit`
  - `/schedule/detail`
- Estado: vistas estáticas ya creadas

### Equipos

- Base: `/equipment`
- Rutas:
  - `/equipment/list`
  - `/equipment/new`
  - `/equipment/edit`
  - `/equipment/detail`
- Estado: tabla y formularios maquetados con datos de ejemplo

### Ordenes

- Base: `/orders`
- Rutas:
  - `/orders/list`
  - `/orders/finished`
  - `/orders/edit`
  - `/orders/detail`
- Estado: pantallas disponibles, sin lógica de dominio conectada

### Solicitudes

- Base: `/requests`
- Rutas:
  - `/requests/list`
  - `/requests/all`
  - `/requests/new`
  - `/requests/edit`
  - `/requests/detail`
- Estado: flujo visual más completo, pero todavía con contenido mock en tablas y formularios

### Usuarios y Roles

- Base: `/users`
- Rutas:
  - `/users/list`
  - `/users/roles`
  - `/users/new`
  - `/users/edit`
  - `/users/detail`
- Estado: vistas estáticas

### Clientes

- Base: `/client`
- Rutas:
  - `/client/list`
  - `/client/new`
  - `/client/edit`
  - `/client/detail`
- Estado: vistas estáticas

## Hallazgos de la revisión

### Lo que ya está hecho

- Layout administrativo consistente en toda la app
- Navegación lateral conectada con las rutas principales
- Separación por features
- Lazy loading por dominio
- Uso coherente de componentes standalone

### Lo que todavía falta

- Servicios Angular para acceso a datos
- Modelos e interfaces de dominio
- Manejo de estado
- Formularios reactivos o template-driven reales
- Validaciones
- Guards de autenticación/autorización
- Integración con backend
- Pruebas de componentes y flujos

## Riesgos y deuda técnica detectada

- El `README.md` original era genérico de Angular y no describía el proyecto.
- La mayor parte de las pantallas renderiza datos hardcodeados.
- No se encontraron servicios, interceptores ni capa HTTP.
- Hay comentarios y textos de apoyo mezclados entre español e inglés.
- En `angular.json` el proyecto se llama `angular-example`, mientras que el paquete se llama `chillsage`.
- Algunas cadenas muestran problemas de codificación, por ejemplo `enfrÃ­a`.
- El proyecto depende de assets de AdminLTE incluidos manualmente en `src/assets`, lo que aumenta el peso del repositorio.

## Verificación realizada

Se ejecutó:

```bash
npm run build
```

Resultado:

- La aplicación compila correctamente.
- El bundle inicial se redujo moviendo AdminLTE y Font Awesome fuera del bundle de Angular.
- La navegación principal fue validada también en navegador con automatización local.

Para desarrollo local:

```bash
npm install
```

## Recomendaciones inmediatas

1. Instalar dependencias y validar `build` y `test`.
2. Crear una capa `core/` con servicios HTTP, interceptores y configuración.
3. Definir interfaces de dominio para solicitudes, ordenes, equipos, usuarios y clientes.
4. Migrar formularios estáticos a formularios reactivos con validación.
5. Reemplazar tablas mock por datos obtenidos desde servicios.
6. Corregir inconsistencias menores de nomenclatura, codificación y markup.

## Archivos clave

- `package.json`: dependencias y scripts
- `angular.json`: configuración de build y assets globales
- `docs/git-workflow.md`: flujo recomendado de ramas y commits
- `src/app/app.config.ts`: providers globales
- `src/app/app.routes.ts`: routing principal
- `src/app/layout/sidebar/sidebar.component.html`: navegación principal
- `src/app/features/**`: pantallas por dominio

## Conclusión

Chillsage Frontend ya tiene una base visual útil para seguir desarrollando un panel administrativo, pero hoy debe tratarse como un prototipo navegable. La siguiente fase razonable es convertir las vistas estáticas en módulos funcionales conectados a una API y respaldados por formularios, validaciones y pruebas.
