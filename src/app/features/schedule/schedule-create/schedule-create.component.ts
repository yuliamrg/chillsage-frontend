import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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

  form: ScheduleFormValue = {
    name: '',
    description: '',
    status: 'Pendiente',
  };

  submit(): void {
    this.schedulesService.create(this.form).subscribe(() => this.router.navigate(['/schedule/list']));
  }
}
