import { Routes } from "@angular/router";
import { ScheduleListComponent } from "./schedule-list/schedule-list.component";
import { ScheduleCreateComponent } from "./schedule-create/schedule-create.component";
import { ScheduleEditComponent } from "./schedule-edit/schedule-edit.component";
import { ScheduleDetailComponent } from "./schedule-detail/schedule-detail.component";


export const SCHEDULE_ROUTES: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ScheduleListComponent },
  { path: 'new', component: ScheduleCreateComponent },
  { path: 'edit/:id', component: ScheduleEditComponent },
  { path: 'detail/:id', component: ScheduleDetailComponent },
]
