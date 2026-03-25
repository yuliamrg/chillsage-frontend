import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ScheduleVm } from '../../../core/models/domain.models';
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
  selector: 'app-schedule-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './schedule-detail.component.html',
  styles: ``,
})
export class ScheduleDetailComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly schedulesService = inject(SchedulesService);

  schedule: ScheduleVm | null = null;
  errorMessage = '';

  ngOnInit(): void {
    const scheduleId = Number(this.route.snapshot.paramMap.get('id'));
    this.errorMessage = history.state?.errorMessage ?? '';
    this.loadSchedule(scheduleId);
  }

  loadSchedule(id: number): void {
    this.errorMessage = '';
    this.schedulesService.getById(id).subscribe({
      next: (schedule) => (this.schedule = schedule),
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cargar el cronograma.'),
    });
  }

  canEdit(): boolean {
    return isEditableSchedule(this.schedule) && this.authService.canAccess('schedules', 'update');
  }

  canOpen(): boolean {
    return canOpenSchedule(this.schedule) && this.authService.canAccess('schedules', 'open');
  }

  canClose(): boolean {
    return canCloseSchedule(this.schedule) && this.authService.canAccess('schedules', 'close');
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

  openSchedule(): void {
    if (!this.schedule) {
      return;
    }

    this.errorMessage = '';
    this.schedulesService.open(this.schedule.id, {}).subscribe({
      next: (schedule) => (this.schedule = schedule),
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible abrir el cronograma.'),
    });
  }

  closeSchedule(): void {
    if (!this.schedule) {
      return;
    }

    this.errorMessage = '';
    this.schedulesService.close(this.schedule.id, {}).subscribe({
      next: (schedule) => (this.schedule = schedule),
      error: (error) => (this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible cerrar el cronograma.'),
    });
  }
}
