import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { ClientVm, ScheduleFilters, ScheduleVm } from '../../../core/models/domain.models';
import { ClientsService } from '../../../core/services/clients.service';
import { SchedulesService } from '../../../core/services/schedules.service';
import { canCloseSchedule, canOpenSchedule, isEditableSchedule } from '../../../core/utils/operational-rules';

const formatDateTime = (value: string | null): string => {
  if (!value) {
    return '-';
  }

  const parsedValue = new Date(value);
  return Number.isNaN(parsedValue.getTime()) ? value : parsedValue.toLocaleString('es-CO');
};

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './schedule-list.component.html',
  styles: ``,
})
export class ScheduleListComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly schedulesService = inject(SchedulesService);
  private readonly clientsService = inject(ClientsService);

  schedules: ScheduleVm[] = [];
  clients: ClientVm[] = [];
  errorMessage = '';
  filters: ScheduleFilters = {
    clientId: null,
    status: null,
    type: null,
    dateFrom: null,
    dateTo: null,
  };

  ngOnInit(): void {
    forkJoin({ clients: this.clientsService.getAll() }).subscribe({
      next: ({ clients }) => (this.clients = clients),
    });
    this.loadSchedules();
  }

  loadSchedules(): void {
    this.errorMessage = '';
    this.schedulesService.getAll(this.filters).subscribe({
      next: (schedules) => (this.schedules = schedules),
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar cronogramas.'),
    });
  }

  clearFilters(): void {
    this.filters = {
      clientId: null,
      status: null,
      type: null,
      dateFrom: null,
      dateTo: null,
    };
    this.loadSchedules();
  }

  canEdit(schedule: ScheduleVm): boolean {
    return isEditableSchedule(schedule) && this.authService.canAccess('schedules', 'update');
  }

  canOpen(schedule: ScheduleVm): boolean {
    return canOpenSchedule(schedule) && this.authService.canAccess('schedules', 'open');
  }

  canClose(schedule: ScheduleVm): boolean {
    return canCloseSchedule(schedule) && this.authService.canAccess('schedules', 'close');
  }

  formatScheduledDate(value: string | null): string {
    return formatDateTime(value);
  }

  formatStatus(status: string): string {
    switch (status) {
      case 'unassigned':
        return 'Sin asignar';
      case 'open':
        return 'Abierto';
      case 'closed':
        return 'Cerrado';
      default:
        return status || '-';
    }
  }

  openSchedule(schedule: ScheduleVm): void {
    this.errorMessage = '';
    this.schedulesService.open(schedule.id, {}).subscribe({
      next: () => this.loadSchedules(),
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible abrir el cronograma.'),
    });
  }

  closeSchedule(schedule: ScheduleVm): void {
    this.errorMessage = '';
    this.schedulesService.close(schedule.id, {}).subscribe({
      next: () => this.loadSchedules(),
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cerrar el cronograma.'),
    });
  }
}
