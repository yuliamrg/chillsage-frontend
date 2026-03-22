import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/auth/permission.guard';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';
import { ScheduleCreateComponent } from './schedule-create/schedule-create.component';
import { ScheduleEditComponent } from './schedule-edit/schedule-edit.component';
import { ScheduleDetailComponent } from './schedule-detail/schedule-detail.component';


export const SCHEDULE_ROUTES: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ScheduleListComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'schedules', action: 'read' } } },
  { path: 'new', component: ScheduleCreateComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'schedules', action: 'create' } } },
  { path: 'edit/:id', component: ScheduleEditComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'schedules', action: 'update' } } },
  { path: 'detail/:id', component: ScheduleDetailComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'schedules', action: 'read' } } },
];
