import { Routes } from "@angular/router"
import { OrdersListComponent } from "./orders-list/orders-list.component"
import { FinishedOrdersComponent } from "./finish-orders-list/finish-orders-list.component"
import { OrdersEditComponent } from "./orders-edit/orders-edit.component"
import { OrdersDetailComponent } from "./orders-detail/orders-detail.component"


export const ORDERS_ROUTES: Routes = [
  { path: 'list', component: OrdersListComponent },
  { path: 'finished', component: FinishedOrdersComponent },
  { path: 'edit/:id', component: OrdersEditComponent },
  { path: 'detail/:id', component: OrdersDetailComponent },
]
