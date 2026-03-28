import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { ClientVm, EquipmentVm, ScheduleFormValue } from '../../../core/models/domain.models';
import { ClientsService } from '../../../core/services/clients.service';
import { EquipmentsService } from '../../../core/services/equipments.service';
import { SchedulesService } from '../../../core/services/schedules.service';

const BLOCKED_EQUIPMENT_STATUSES = new Set(['de_baja', 'retirado', 'retired']);

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
  selector: 'app-schedule-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './schedule-create.component.html',
  styles: ``,
})
export class ScheduleCreateComponent implements OnInit {
  private readonly router = inject(Router);
  readonly authService = inject(AuthService, { optional: true });
  private readonly schedulesService = inject(SchedulesService);
  private readonly clientsService = inject(ClientsService);
  private readonly equipmentsService = inject(EquipmentsService);

  clients: ClientVm[] = [];
  equipments: EquipmentVm[] = [];
  errorMessage = '';
  isSaving = false;
  form: ScheduleFormValue = {
    clientId: null,
    name: '',
    type: 'preventive',
    scheduledDate: null,
    description: '',
    equipmentIds: [],
  };

  ngOnInit(): void {
    forkJoin({
      clients: this.clientsService.getAll(),
      equipments: this.equipmentsService.getAll(),
    }).subscribe({
      next: ({ clients, equipments }) => {
        this.clients =
          typeof this.authService?.getScopedClients === 'function'
            ? this.authService.getScopedClients(clients)
            : clients;
        this.equipments = equipments;
        this.form.clientId =
          typeof this.authService?.getPreferredClientId === 'function'
            ? this.authService.getPreferredClientId()
            : this.form.clientId;
      },
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar los datos del cronograma.'),
    });
  }

  get showClientSelector(): boolean {
    return typeof this.authService?.buildClientScopeOptions === 'function'
      ? this.authService.buildClientScopeOptions(this.clients).showSelector
      : true;
  }

  get filteredEquipments(): EquipmentVm[] {
    return this.equipments.filter((equipment) => {
      const normalizedStatus = equipment.status.trim().toLowerCase();
      if (BLOCKED_EQUIPMENT_STATUSES.has(normalizedStatus)) {
        return false;
      }

      return !this.form.clientId || equipment.clientId === this.form.clientId;
    });
  }

  toggleEquipment(equipmentId: number): void {
    if (this.form.equipmentIds.includes(equipmentId)) {
      this.form.equipmentIds = this.form.equipmentIds.filter((id) => id !== equipmentId);
      return;
    }

    this.form.equipmentIds = [...this.form.equipmentIds, equipmentId];
  }

  onClientChange(): void {
    const validEquipmentIds = new Set(this.filteredEquipments.map((equipment) => equipment.id));
    this.form.equipmentIds = this.form.equipmentIds.filter((equipmentId) => validEquipmentIds.has(equipmentId));
  }

  private validateForm(): string | null {
    if (!this.form.clientId) {
      return 'Debe seleccionar un cliente.';
    }

    if (!this.form.name.trim()) {
      return 'Debe ingresar un nombre para el cronograma.';
    }

    if (!this.form.scheduledDate) {
      return 'Debe ingresar la fecha programada.';
    }

    if (this.form.equipmentIds.length === 0) {
      return 'Debe seleccionar al menos un equipo.';
    }

    const validEquipmentIds = new Set(this.filteredEquipments.map((equipment) => equipment.id));
    const hasInvalidEquipment = this.form.equipmentIds.some((equipmentId) => !validEquipmentIds.has(equipmentId));

    if (hasInvalidEquipment) {
      return 'Todos los equipos deben pertenecer al cliente seleccionado y estar disponibles.';
    }

    this.form = {
      ...this.form,
      name: this.form.name.trim(),
      description: this.form.description.trim(),
      scheduledDate: toDateTimeLocalValue(this.form.scheduledDate),
    };

    return null;
  }

  submit(): void {
    this.errorMessage = '';
    const validationError = this.validateForm();
    if (validationError) {
      this.errorMessage = validationError;
      return;
    }

    this.isSaving = true;
    this.schedulesService.create(this.form).pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => void this.router.navigate(['/schedule/list']),
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible crear el cronograma.'),
    });
  }
}
