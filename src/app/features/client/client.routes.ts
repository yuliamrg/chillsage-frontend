import { Routes } from '@angular/router'
import { ClientCreateComponent } from './client-create/client-create.component'
import { ClientListComponent } from './client-list/client-list.component'
import { ClientEditComponent } from './client-edit/client-edit.component'
import { ClientDetailComponent } from './client-detail/client-detail.component'


export const CLIENT_ROUTES: Routes = [
  { path: 'new', component: ClientCreateComponent},
  { path: 'list', component: ClientListComponent},
  { path: 'edit/:id', component: ClientEditComponent},
  { path: 'detail/:id', component: ClientDetailComponent},
]
