import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/auth/permission.guard';
import { RequestsListComponent } from './requests-list/requests-list.component';
import { RequestsCreateComponent } from './requests-create/requests-create.component';
import { RequestsEditComponent } from './requests-edit/requests-edit.component';
import { RequestsDetailComponent } from './requests-detail/requests-detail.component';

export const REQUESTS_ROUTES: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: RequestsListComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'requests', action: 'read' } } },
  { path: 'all', redirectTo: 'list', pathMatch: 'full' },
  { path: 'new', component: RequestsCreateComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'requests', action: 'create' } } },
  { path: 'edit/:id', component: RequestsEditComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'requests', action: 'update' } } },
  { path: 'detail/:id', component: RequestsDetailComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'requests', action: 'read' } } },
];
