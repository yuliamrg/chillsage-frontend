import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/auth/permission.guard';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrdersCreateComponent } from './orders-create/orders-create.component';
import { FinishedOrdersComponent } from './finish-orders-list/finish-orders-list.component';
import { OrdersEditComponent } from './orders-edit/orders-edit.component';
import { OrdersDetailComponent } from './orders-detail/orders-detail.component';


export const ORDERS_ROUTES: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: OrdersListComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'orders', action: 'read' } } },
  { path: 'new', component: OrdersCreateComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'orders', action: 'create' } } },
  { path: 'finished', component: FinishedOrdersComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'orders', action: 'read' } } },
  { path: 'edit/:id', component: OrdersEditComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'orders', action: 'update' } } },
  { path: 'detail/:id', component: OrdersDetailComponent, canActivate: [permissionGuard], data: { requiredPermission: { resource: 'orders', action: 'read' } } },
];
