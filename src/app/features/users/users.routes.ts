import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/auth/permission.guard';
import { UsersRolesListComponent } from './users-roles-list/users-roles-list.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersCreateComponent } from './users-create/users-create.component';
import { UsersEditComponent } from './users-edit/users-edit.component';
import { UsersDetailComponent } from './users-detail/users-detail.component';

export const USERS_ROUTES: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: UsersListComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'users', action: 'read' } } },
  { path: 'roles', component: UsersRolesListComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'roles', action: 'read' } } },
  { path: 'new', component: UsersCreateComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'users', action: 'create' } } },
  { path: 'edit/:id', component: UsersEditComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'users', action: 'update' } } },
  { path: 'detail/:id', component: UsersDetailComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'users', action: 'read' } } },
];
