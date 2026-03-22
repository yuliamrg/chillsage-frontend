import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import {
  mapSchedule,
  mapScheduleCloseFormToApi,
  mapScheduleFormToApi,
  mapScheduleOpenFormToApi,
} from '../mappers/domain.mappers';
import {
  ScheduleCloseFormValue,
  ScheduleFilters,
  ScheduleFormValue,
  ScheduleOpenFormValue,
} from '../models/domain.models';

@Injectable({ providedIn: 'root' })
export class SchedulesService {
  private readonly api = inject(ApiClientService);

  getAll(filters?: ScheduleFilters) {
    return this.api
      .get<{ schedules: unknown[] }>('/schedules', {
        client_id: filters?.clientId,
        status: filters?.status,
        type: filters?.type,
        date_from: filters?.dateFrom,
        date_to: filters?.dateTo,
      })
      .pipe(map((response) => (response.schedules ?? []).map(mapSchedule)));
  }

  getById(id: number) {
    return this.api.get<{ schedule: unknown }>(`/schedules/${id}`).pipe(map((response) => mapSchedule(response.schedule)));
  }

  create(payload: ScheduleFormValue) {
    return this.api
      .post<{ schedule: unknown }>('/schedules', mapScheduleFormToApi(payload))
      .pipe(map((response) => mapSchedule(response.schedule)));
  }

  update(id: number, payload: ScheduleFormValue) {
    return this.api
      .put<{ schedule: unknown }>(`/schedules/${id}`, mapScheduleFormToApi(payload))
      .pipe(map((response) => mapSchedule(response.schedule)));
  }

  open(id: number, payload: ScheduleOpenFormValue) {
    return this.api
      .post<{ schedule: unknown }>(`/schedules/${id}/open`, mapScheduleOpenFormToApi(payload))
      .pipe(map((response) => mapSchedule(response.schedule)));
  }

  close(id: number, payload: ScheduleCloseFormValue) {
    return this.api
      .post<{ schedule: unknown }>(`/schedules/${id}/close`, mapScheduleCloseFormToApi(payload))
      .pipe(map((response) => mapSchedule(response.schedule)));
  }

  remove(id: number) {
    return this.api.delete<{ schedule: unknown }>(`/schedules/${id}`).pipe(map((response) => mapSchedule(response.schedule)));
  }
}
