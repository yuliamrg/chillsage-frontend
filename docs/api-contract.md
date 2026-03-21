# Contrato API Inferido para Chillsage Frontend

## Objetivo

Este documento describe lo que el frontend actual parece esperar consumir desde una API, a partir de las pantallas, rutas y formularios existentes.

No es un contrato oficial ya implementado en código. Es un contrato inferido del comportamiento visible del frontend y sirve como base para diseñar el backend.

## Estado actual del frontend

- No existe capa HTTP implementada.
- No existen servicios Angular, interceptores ni DTOs.
- Las pantallas son estáticas y usan datos mock.
- Las rutas actuales no incluyen parámetros dinámicos como `:id`, aunque las vistas sí representan operaciones de listar, ver, crear, editar y eliminar.

## Convenciones recomendadas

- Base URL sugerida: `/api/v1`
- Formato de respuesta: JSON
- Fechas: ISO 8601
- Identificadores: numéricos o UUID, pero consistentes por entidad
- Respuestas de lista: incluir colección y, de ser posible, metadatos de paginación

Ejemplo:

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "pageSize": 10
}
```

## Entidades y endpoints

### Clientes

Pantallas observadas:

- `/client/list`
- `/client/new`
- `/client/edit`
- `/client/detail`

Campos visibles:

- `id`
- `name`
- `nit`
- `address`
- `email`

Ejemplo de objeto:

```json
{
  "id": 1,
  "name": "Clinica de occidente",
  "nit": "890450723",
  "address": "Calle 18 Norte # 5N-34",
  "email": "clinicadeoccidente.com"
}
```

Endpoints sugeridos:

- `GET /api/v1/clients`
- `GET /api/v1/clients/{id}`
- `POST /api/v1/clients`
- `PUT /api/v1/clients/{id}`
- `DELETE /api/v1/clients/{id}`

Payload mínimo de creación/edición:

```json
{
  "name": "Clinica de occidente",
  "nit": "890450723",
  "address": "Calle 18 Norte # 5N-34",
  "email": "clinicadeoccidente.com"
}
```

### Equipos

Pantallas observadas:

- `/equipment/list`
- `/equipment/new`
- `/equipment/edit`
- `/equipment/detail`

Campos visibles:

- `id`
- `name`
- `brand`
- `model`
- `serial`
- `fixedAssetCode`
- `clientId`
- `clientName`
- `location`
- `observations`

Ejemplo de objeto:

```json
{
  "id": 1,
  "name": "Aire Acondicionado",
  "brand": "York",
  "model": "YSM",
  "serial": "123456",
  "fixedAssetCode": "CDO123",
  "clientId": 1,
  "clientName": "Clinica de occidente",
  "location": "Rayos X",
  "observations": "lorem ipsum dolor sit amet consectetur adipisicing elit"
}
```

Endpoints sugeridos:

- `GET /api/v1/equipment`
- `GET /api/v1/equipment/{id}`
- `POST /api/v1/equipment`
- `PUT /api/v1/equipment/{id}`
- `DELETE /api/v1/equipment/{id}`

Soportes auxiliares sugeridos:

- `GET /api/v1/clients`

Payload mínimo de creación/edición:

```json
{
  "name": "Aire Acondicionado",
  "brand": "York",
  "model": "YSM",
  "serial": "123456",
  "fixedAssetCode": "CDO123",
  "clientId": 1,
  "location": "Rayos X",
  "observations": "Texto libre"
}
```

### Solicitudes

Pantallas observadas:

- `/requests/list`
- `/requests/all`
- `/requests/new`
- `/requests/edit`
- `/requests/detail`

Campos visibles:

- `id`
- `requestType`
- `requestTypeId`
- `requesterId`
- `requesterName`
- `equipmentId`
- `equipmentSummary`
- `createdAt`
- `status`
- `description`
- `location`
- `observations`

Estados visibles:

- `Pendiente`
- `Aprobada`
- `Anulada`

Tipos visibles:

- `Correctivo`
- `Preventivo`
- `Instalacion`
- `Otros`

Ejemplo de objeto:

```json
{
  "id": 1,
  "requestType": "Correctivo",
  "requesterId": 12,
  "requesterName": "Yuliam Rivera",
  "equipmentId": 1,
  "equipmentSummary": "Aire Acondicionado, York, YSM, 123456, CDO123",
  "createdAt": "2024-10-01T08:00:00",
  "status": "Pendiente",
  "description": "Se solicita reparacion del equipo, no enfria",
  "location": "Clinica de occidente, Rayos X",
  "observations": "ninguna"
}
```

Endpoints sugeridos:

- `GET /api/v1/requests`
- `GET /api/v1/requests?status=open`
- `GET /api/v1/requests?status=all`
- `GET /api/v1/requests/{id}`
- `POST /api/v1/requests`
- `PUT /api/v1/requests/{id}`
- `DELETE /api/v1/requests/{id}`

Soportes auxiliares sugeridos:

- `GET /api/v1/request-types`
- `GET /api/v1/equipment`
- `GET /api/v1/locations?equipmentId={id}`

Payload mínimo de creación:

```json
{
  "requestTypeId": 1,
  "equipmentId": 1,
  "description": "Se solicita reparacion del equipo, no enfria",
  "location": "Rayos X",
  "observations": "ninguna"
}
```

Payload mínimo de edición:

```json
{
  "description": "Se solicita reparacion del equipo, no enfria",
  "equipmentId": 1,
  "status": "Aprobada",
  "location": "Rayos X",
  "observations": "ninguna"
}
```

### Ordenes

Pantallas observadas:

- `/orders/list`
- `/orders/finished`
- `/orders/edit`
- `/orders/detail`

Campos visibles:

- `id`
- `sourceType`
- `sourceId`
- `requesterName`
- `createdAt`
- `description`
- `responsibleName`
- `equipmentId`
- `equipmentSummary`
- `status`
- `location`
- `observations`

El frontend sugiere que una orden puede originarse en una solicitud.

Ejemplo de objeto:

```json
{
  "id": 1,
  "sourceType": "request",
  "sourceId": 1,
  "requesterName": "Yuliam Rivera",
  "createdAt": "2024-10-01T08:00:00",
  "description": "Se solicita reparacion del equipo, no enfria",
  "responsibleName": "Deyvis Cruz",
  "equipmentId": 1,
  "equipmentSummary": "Aire Acondicionado, York, YSM, 123456, CDO123",
  "status": "Aprobada",
  "location": "Clinica de occidente, Rayos X",
  "observations": "ninguna"
}
```

Endpoints sugeridos:

- `GET /api/v1/orders`
- `GET /api/v1/orders?status=pending`
- `GET /api/v1/orders?status=finished`
- `GET /api/v1/orders/{id}`
- `POST /api/v1/orders`
- `PUT /api/v1/orders/{id}`
- `DELETE /api/v1/orders/{id}`

Soportes auxiliares sugeridos:

- `GET /api/v1/users?role=Tecnico`
- `GET /api/v1/requests`
- `GET /api/v1/equipment`

Payload mínimo de creación/edición sugerido:

```json
{
  "sourceType": "request",
  "sourceId": 1,
  "responsibleUserId": 25,
  "equipmentId": 1,
  "status": "Aprobada",
  "location": "Rayos X",
  "observations": "ninguna",
  "description": "Se solicita reparacion del equipo, no enfria"
}
```

### Cronogramas

Pantallas observadas:

- `/schedule/list`
- `/schedule/new`
- `/schedule/edit`
- `/schedule/detail`

Campos visibles:

- `id`
- `name`
- `clientId`
- `clientName`
- `executionDate`
- `scheduleType`
- `description`
- `status`
- `equipmentIds`
- `equipmentItems`

Tipos visibles:

- `Calibracion`
- `Preventivo`
- `Limpieza`
- `Otros`

Estados visibles:

- `Pendiente`

Ejemplo de objeto:

```json
{
  "id": 1,
  "name": "Mantenimiento preventivo Aire acondicionado",
  "clientId": 1,
  "clientName": "Clinica de occidente",
  "executionDate": "2024-09-01T08:00:00",
  "scheduleType": "Preventivo",
  "description": "Mantenimiento preventivo a los aires acondicionados de la clinica de occidente",
  "status": "Pendiente",
  "equipmentIds": [1, 2, 5, 8]
}
```

Endpoints sugeridos:

- `GET /api/v1/schedules`
- `GET /api/v1/schedules/{id}`
- `POST /api/v1/schedules`
- `PUT /api/v1/schedules/{id}`
- `DELETE /api/v1/schedules/{id}`

Soportes auxiliares sugeridos:

- `GET /api/v1/clients`
- `GET /api/v1/equipment?clientId={id}`
- `GET /api/v1/schedule-types`

Payload mínimo de creación/edición:

```json
{
  "name": "Mantenimiento preventivo Aire acondicionado",
  "clientId": 1,
  "executionDate": "2024-09-01T08:00:00",
  "scheduleType": "Preventivo",
  "description": "Mantenimiento preventivo a los aires acondicionados de la clinica de occidente",
  "status": "Pendiente",
  "equipmentIds": [1, 2]
}
```

### Usuarios

Pantallas observadas:

- `/users/list`
- `/users/roles`
- `/users/new`
- `/users/edit`
- `/users/detail`

Campos visibles:

- `id`
- `firstName`
- `lastName`
- `email`
- `clientId`
- `clientName`
- `phone`
- `roleId`
- `roleName`

Roles visibles:

- `Administrador`
- `Tecnico`
- `Planeador`
- `Solicitante`

Ejemplo de objeto:

```json
{
  "id": 1,
  "firstName": "Yuliam",
  "lastName": "Rivera",
  "email": "yurivera@gmail.com",
  "clientId": 1,
  "clientName": "Clinica de occidente",
  "phone": "12345",
  "roleId": 4,
  "roleName": "Solicitante"
}
```

Endpoints sugeridos:

- `GET /api/v1/users`
- `GET /api/v1/users/{id}`
- `POST /api/v1/users`
- `PUT /api/v1/users/{id}`
- `DELETE /api/v1/users/{id}`
- `GET /api/v1/roles`

Soportes auxiliares sugeridos:

- `GET /api/v1/clients`

Payload mínimo de creación/edición:

```json
{
  "firstName": "Yuliam",
  "lastName": "Rivera",
  "email": "yurivera@gmail.com",
  "clientId": 1,
  "phone": "12345",
  "roleId": 4
}
```

## Catálogos auxiliares

Para evitar hardcodear opciones en el frontend, la API debería exponer catálogos para:

- tipos de solicitud
- tipos de cronograma
- roles
- estados de solicitud
- estados de orden
- estados de cronograma
- clientes
- equipos
- ubicaciones por cliente o por equipo

Ejemplo:

```json
[
  { "id": 1, "name": "Correctivo" },
  { "id": 2, "name": "Preventivo" }
]
```

## Diferencias entre frontend actual y contrato recomendado

- Las rutas del frontend hoy usan `/edit` y `/detail` sin `id`; para integración real conviene migrar a rutas como `/edit/:id` y `/detail/:id`.
- En listas, varios campos aparecen como textos ya formateados, pero una API debería devolver identificadores y objetos relacionados por separado.
- Algunas opciones se muestran como `select` aunque conceptualmente son texto libre o catálogos.
- El frontend mezcla estados y tipos como texto. El backend debería soportar tanto `id` como `name`, o al menos un valor estable de máquina como `code`.

## Recomendación mínima para implementación

Si el backend se quiere alinear rápido con el frontend, el orden más útil es:

1. `clients`
2. `equipment`
3. `users`
4. `requests`
5. `orders`
6. `schedules`
7. catálogos auxiliares

Con eso se cubren primero los selectores dependientes y luego los módulos relacionales.
