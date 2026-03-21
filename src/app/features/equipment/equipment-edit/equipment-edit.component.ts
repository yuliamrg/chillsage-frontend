import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientVm, EquipmentFormValue } from '../../../core/models/domain.models';
import { ClientsService } from '../../../core/services/clients.service';
import { EquipmentsService } from '../../../core/services/equipments.service';

@Component({
  selector: 'app-equipment-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './equipment-edit.component.html',
  styles: ``,
})
export class EquipmentEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clientsService = inject(ClientsService);
  private readonly equipmentsService = inject(EquipmentsService);

  equipmentId = 0;
  clients: ClientVm[] = [];
  errorMessage = '';
  form: EquipmentFormValue = {
    name: '',
    type: '',
    location: '',
    brand: '',
    model: '',
    serial: '',
    fixedAssetCode: '',
    alias: '',
    clientId: null,
    observations: '',
    status: 'active',
  };

  ngOnInit(): void {
    this.equipmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.clientsService.getAll().subscribe((clients) => (this.clients = clients));
    this.equipmentsService.getById(this.equipmentId).subscribe({
      next: (equipment) => {
        this.form = {
          name: equipment.name,
          type: equipment.type,
          location: equipment.location,
          brand: equipment.brand,
          model: equipment.model,
          serial: equipment.serial,
          fixedAssetCode: equipment.fixedAssetCode,
          alias: equipment.alias,
          clientId: equipment.clientId,
          observations: equipment.observations,
          status: equipment.status || 'active',
        };
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar el equipo.';
      },
    });
  }

  submit(): void {
    this.equipmentsService.update(this.equipmentId, this.form).subscribe({
      next: () => this.router.navigate(['/equipment/list']),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible actualizar el equipo.';
      },
    });
  }
}
