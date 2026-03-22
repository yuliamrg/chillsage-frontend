import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/auth/permission.guard';
import { ClientCreateComponent } from './client-create/client-create.component';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientEditComponent } from './client-edit/client-edit.component';
import { ClientDetailComponent } from './client-detail/client-detail.component';


export const CLIENT_ROUTES: Routes = [
  { path: 'new', component: ClientCreateComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'clients', action: 'create' } } },
  { path: 'list', component: ClientListComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'clients', action: 'read' } } },
  { path: 'edit/:id', component: ClientEditComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'clients', action: 'update' } } },
  { path: 'detail/:id', component: ClientDetailComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'clients', action: 'read' } } },
];
