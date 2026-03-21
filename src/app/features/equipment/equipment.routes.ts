import { Routes } from '@angular/router';
import { EquipmenListComponent } from './equipment-list/equipment-list.component'
import { EquipmentCreateComponent } from './equipment-create/equipment-create.component'
import { EquipmentDetailsComponent } from './equipment-details/equipment-details.component';
import { EquipmentEditComponent } from './equipment-edit/equipment-edit.component';
export const EQUIPMENT_ROUTES: Routes = [
  { path: 'list', component: EquipmenListComponent },
  { path: 'new', component: EquipmentCreateComponent },
  { path: 'detail/:id', component: EquipmentDetailsComponent },
  { path: 'edit/:id', component: EquipmentEditComponent },
];
