import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/auth/permission.guard';
import { EquipmenListComponent } from './equipment-list/equipment-list.component'
import { EquipmentCreateComponent } from './equipment-create/equipment-create.component'
import { EquipmentDetailsComponent } from './equipment-details/equipment-details.component';
import { EquipmentEditComponent } from './equipment-edit/equipment-edit.component';
export const EQUIPMENT_ROUTES: Routes = [
  { path: 'list', component: EquipmenListComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'equipments', action: 'read' } } },
  { path: 'new', component: EquipmentCreateComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'equipments', action: 'create' } } },
  { path: 'detail/:id', component: EquipmentDetailsComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'equipments', action: 'read' } } },
  { path: 'edit/:id', component: EquipmentEditComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'equipments', action: 'update' } } },
];
