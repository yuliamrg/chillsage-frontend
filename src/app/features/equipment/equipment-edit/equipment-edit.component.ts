import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { ClientVm, EquipmentFormValue } from '../../../core/models/domain.models';
import { ClientsService } from '../../../core/services/clients.service';
import { EquipmentsService } from '../../../core/services/equipments.service';

const EQUIPMENT_STATUS_OPTIONS: readonly string[] = ['active', 'inactive', 'maintenance', 'retired'];

const toDateTimeLocalValue = (value: string | null): string | null => {
  if (!value) {
    return null;
  }

  const parsedValue = new Date(value);
  if (Number.isNaN(parsedValue.getTime())) {
    return value.slice(0, 16);
  }

  const timezoneOffset = parsedValue.getTimezoneOffset() * 60000;
  return new Date(parsedValue.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

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
  private readonly authService = inject(AuthService);
  private readonly clientsService = inject(ClientsService);
  private readonly equipmentsService = inject(EquipmentsService);

  equipmentId = 0;
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

  get isPlanner(): boolean {
    return this.authService.role() === 'planeador';
  }

  ngOnInit(): void {
    this.equipmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.clientsService.getAll().subscribe((clients) => {
      this.clients =
        typeof this.authService.getScopedClients === 'function'
          ? this.authService.getScopedClients(clients)
          : clients;
    });
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
          useStartAt: toDateTimeLocalValue(equipment.useStartAt),
          useEndAt: toDateTimeLocalValue(equipment.useEndAt),
        };
      },
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar el equipo.';
      },
    });
  }

  get showClientSelector(): boolean {
    return typeof this.authService.buildClientScopeOptions === 'function'
      ? this.authService.buildClientScopeOptions(this.clients).showSelector
      : true;
  }

  private validateForm(): string | null {
    if (!this.isPlanner) {
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

    const payload = this.isPlanner
      ? {
          location: this.form.location,
          alias: this.form.alias,
          observations: this.form.observations,
          status: this.form.status,
          useStartAt: this.form.useStartAt,
          useEndAt: this.form.useEndAt,
        }
      : this.form;

    this.isSaving = true;
    this.equipmentsService.update(this.equipmentId, payload).pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => this.router.navigate(['/equipment/list']),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible actualizar el equipo.';
      },
    });
  }
}
