import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ScheduleFormValue } from '../../../core/models/domain.models';
import { SchedulesService } from '../../../core/services/schedules.service';

@Component({
  selector: 'app-schedule-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './schedule-create.component.html',
  styles: ``,
})
export class ScheduleCreateComponent {
  private readonly router = inject(Router);
  private readonly schedulesService = inject(SchedulesService);

  errorMessage = '';
  isSaving = false;
  form: ScheduleFormValue = {
    name: '',
    description: '',
    status: 'Pendiente',
  };

  submit(): void {
    if (this.isSaving) {
      return;
    }

    this.errorMessage = '';
    this.isSaving = true;

    this.schedulesService.create(this.form).pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => void this.router.navigate(['/schedule/list']),
      error: (error) => {
        this.errorMessage = error?.error?.msg ?? error?.message ?? 'No fue posible crear el cronograma.';
      },
    });
  }
}
