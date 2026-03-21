import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ScheduleFormValue } from '../../../core/models/domain.models';
import { SchedulesService } from '../../../core/services/schedules.service';

@Component({
  selector: 'app-schedule-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './schedule-edit.component.html',
  styles: ``,
})
export class ScheduleEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly schedulesService = inject(SchedulesService);

  scheduleId = 0;
  form: ScheduleFormValue = {
    name: '',
    description: '',
    status: 'Pendiente',
  };

  ngOnInit(): void {
    this.scheduleId = Number(this.route.snapshot.paramMap.get('id'));
    this.schedulesService.getById(this.scheduleId).subscribe((schedule) => {
      this.form = {
        name: schedule.name,
        description: schedule.description,
        status: schedule.status,
      };
    });
  }

  submit(): void {
    this.schedulesService.update(this.scheduleId, this.form).subscribe(() => this.router.navigate(['/schedule/list']));
  }
}
