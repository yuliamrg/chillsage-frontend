import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { mapSchedule, mapScheduleFormToApi } from '../mappers/domain.mappers';
import { ScheduleFormValue } from '../models/domain.models';

@Injectable({ providedIn: 'root' })
export class SchedulesService {
  private readonly api = inject(ApiClientService);

  getAll() {
    return this.api.get<{ schedules: unknown[] }>('/schedules').pipe(map((response) => (response.schedules ?? []).map(mapSchedule)));
  }

  getById(id: number) {
    return this.api.get<{ schedule: unknown }>(`/schedules/${id}`).pipe(map((response) => mapSchedule(response.schedule)));
  }

  create(payload: ScheduleFormValue) {
    return this.api.post<{ schedule: unknown }>('/schedules', mapScheduleFormToApi(payload)).pipe(map((response) => mapSchedule(response.schedule)));
  }

  update(id: number, payload: ScheduleFormValue) {
    return this.api.put<{ schedule: unknown }>(`/schedules/${id}`, mapScheduleFormToApi(payload)).pipe(map((response) => mapSchedule(response.schedule)));
  }

  remove(id: number) {
    return this.api.delete<{ schedule: unknown }>(`/schedules/${id}`).pipe(map((response) => mapSchedule(response.schedule)));
  }
}
