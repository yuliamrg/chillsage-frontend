import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ClientVm, EquipmentFormValue } from '../../../core/models/domain.models';
import { ClientsService } from '../../../core/services/clients.service';
import { EquipmentsService } from '../../../core/services/equipments.service';

@Component({
  selector: 'app-equipment-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './equipment-create.component.html',
  styles: ``,
})
export class EquipmentCreateComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly clientsService = inject(ClientsService);
  private readonly equipmentsService = inject(EquipmentsService);

  clients: ClientVm[] = [];
  errorMessage = '';
  isSaving = false;
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
    this.clientsService.getAll().subscribe((clients) => (this.clients = clients));
  }

  submit(): void {
    if (this.isSaving) {
      return;
    }

    this.errorMessage = '';
    this.isSaving = true;

    this.equipmentsService.create(this.form).pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => void this.router.navigate(['/equipment/list']),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible crear el equipo.';
      },
    });
  }
}
