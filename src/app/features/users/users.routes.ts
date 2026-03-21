import { Routes } from '@angular/router';
import { UsersRolesListComponent } from './users-roles-list/users-roles-list.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersCreateComponent } from './users-create/users-create.component';
import { UsersEditComponent } from './users-edit/users-edit.component';
import { UsersDetailComponent } from './users-detail/users-detail.component';

export const USERS_ROUTES: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: UsersListComponent },
  { path: 'roles', component: UsersRolesListComponent },
  { path: 'new', component: UsersCreateComponent },
  { path: 'edit/:id', component: UsersEditComponent },
  { path: 'detail/:id', component: UsersDetailComponent },
];
