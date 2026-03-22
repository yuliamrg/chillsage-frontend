import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ScheduleVm } from '../../../core/models/domain.models';
import { SchedulesService } from '../../../core/services/schedules.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './schedule-list.component.html',
  styles: ``,
})
export class ScheduleListComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly schedulesService = inject(SchedulesService);

  schedules: ScheduleVm[] = [];

  ngOnInit(): void {
    this.schedulesService.getAll().subscribe((schedules) => (this.schedules = schedules));
  }

  canCreateSchedules(): boolean {
    return this.authService.canAccess('schedules', 'create');
  }

  canUpdateSchedules(): boolean {
    return this.authService.canAccess('schedules', 'update');
  }
}
