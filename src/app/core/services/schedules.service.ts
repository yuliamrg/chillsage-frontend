import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { DEFAULT_LOOKUP_LIMIT, mapPaginatedCollectionResponse } from '../api/pagination.utils';
import {
  mapSchedule,
  mapScheduleCloseFormToApi,
  mapScheduleFormToApi,
  mapScheduleOpenFormToApi,
} from '../mappers/domain.mappers';
import {
  CollectionQuery,
  ScheduleCloseFormValue,
  ScheduleFilters,
  ScheduleFormValue,
  ScheduleOpenFormValue,
} from '../models/domain.models';

@Injectable({ providedIn: 'root' })
export class SchedulesService {
  private readonly api = inject(ApiClientService);

  list(query?: ScheduleFilters & CollectionQuery) {
    return this.api
      .get<{ schedules: unknown[]; meta?: unknown }>('/schedules', {
        client_id: query?.clientId,
        status: query?.status,
        type: query?.type,
        date_from: query?.dateFrom,
        date_to: query?.dateTo,
        page: query?.page,
        limit: query?.limit,
        sort: query?.sort,
      })
      .pipe(map((response) => mapPaginatedCollectionResponse(response, 'schedules', mapSchedule)));
  }

  getAll(filters?: ScheduleFilters) {
    return this.list({ ...filters, limit: DEFAULT_LOOKUP_LIMIT }).pipe(map((response) => response.items));
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
