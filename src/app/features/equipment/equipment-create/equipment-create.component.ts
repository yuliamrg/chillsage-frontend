import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ClientVm, EquipmentFormValue } from '../../../core/models/domain.models';
import { ClientsService } from '../../../core/services/clients.service';
import { EquipmentsService } from '../../../core/services/equipments.service';

const EQUIPMENT_STATUS_OPTIONS: readonly string[] = ['active', 'inactive', 'maintenance', 'retired'];

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
  readonly statusOptions = EQUIPMENT_STATUS_OPTIONS;
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
    useStartAt: null,
    useEndAt: null,
  };

  ngOnInit(): void {
    this.clientsService.getAll().subscribe((clients) => (this.clients = clients));
  }

  private validateForm(): string | null {
    if (!this.form.name.trim()) {
      return 'Debe ingresar el nombre del equipo.';
    }

    if (!this.form.serial.trim()) {
      return 'Debe ingresar la serie del equipo.';
    }

    if (!this.form.fixedAssetCode.trim()) {
      return 'Debe ingresar el codigo de activo fijo.';
    }

    if (!this.form.clientId) {
      return 'Debe seleccionar un cliente.';
    }

    if (!this.statusOptions.includes(this.form.status)) {
      return 'Debe seleccionar un estado valido.';
    }

    if (this.form.useStartAt && this.form.useEndAt) {
      const useStartAt = new Date(this.form.useStartAt);
      const useEndAt = new Date(this.form.useEndAt);
      if (!Number.isNaN(useStartAt.getTime()) && !Number.isNaN(useEndAt.getTime()) && useEndAt < useStartAt) {
        return 'La fecha de fin de uso no puede ser menor que la fecha de inicio de uso.';
      }
    }

    this.form = {
      ...this.form,
      name: this.form.name.trim(),
      type: this.form.type.trim(),
      location: this.form.location.trim(),
      brand: this.form.brand.trim(),
      model: this.form.model.trim(),
      serial: this.form.serial.trim(),
      fixedAssetCode: this.form.fixedAssetCode.trim(),
      alias: this.form.alias.trim(),
      observations: this.form.observations.trim(),
    };

    return null;
  }

  submit(): void {
    if (this.isSaving) {
      return;
    }

    this.errorMessage = '';
    const validationError = this.validateForm();
    if (validationError) {
      this.errorMessage = validationError;
      return;
    }

    this.isSaving = true;

    this.equipmentsService.create(this.form).pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => void this.router.navigate(['/equipment/list']),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible crear el equipo.';
      },
    });
  }
}
