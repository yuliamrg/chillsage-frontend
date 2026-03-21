import { Routes } from '@angular/router';
import { AllRequestsComponent } from './all-requests-list/all-requests-list.component';
import { RequestsListComponent } from './requests-list/requests-list.component';
import { RequestsCreateComponent } from './requests-create/requests-create.component';
import { RequestsEditComponent } from './requests-edit/requests-edit.component';
import { RequestsDetailComponent } from './requests-detail/requests-detail.component';

export const REQUESTS_ROUTES: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: RequestsListComponent },
  { path: 'all', component: AllRequestsComponent },
  { path: 'new', component: RequestsCreateComponent },
  { path: 'edit/:id', component: RequestsEditComponent },
  { path: 'detail/:id', component: RequestsDetailComponent },
];
