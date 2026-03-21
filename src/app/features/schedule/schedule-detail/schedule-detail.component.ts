import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ScheduleVm } from '../../../core/models/domain.models';
import { SchedulesService } from '../../../core/services/schedules.service';

@Component({
  selector: 'app-schedule-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './schedule-detail.component.html',
  styles: ``,
})
export class ScheduleDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly schedulesService = inject(SchedulesService);

  schedule: ScheduleVm | null = null;

  ngOnInit(): void {
    const scheduleId = Number(this.route.snapshot.paramMap.get('id'));
    this.schedulesService.getById(scheduleId).subscribe((schedule) => (this.schedule = schedule));
  }
}
