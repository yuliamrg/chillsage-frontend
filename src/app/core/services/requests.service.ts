import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import {
  mapRequest,
  mapRequestApprovalFormToApi,
  mapRequestCancelFormToApi,
  mapRequestFormToApi,
} from '../mappers/domain.mappers';
import {
  RequestApprovalFormValue,
  RequestCancelFormValue,
  RequestFilters,
  RequestFormValue,
} from '../models/domain.models';

@Injectable({ providedIn: 'root' })
export class RequestsService {
  private readonly api = inject(ApiClientService);

  getAll(filters?: RequestFilters) {
    return this.api
      .get<{ requests: unknown[] }>('/requests', {
        client_id: filters?.clientId,
        requester_user_id: filters?.requesterUserId,
        equipment_id: filters?.equipmentId,
        status: filters?.status,
        type: filters?.type,
        date_from: filters?.dateFrom,
        date_to: filters?.dateTo,
      })
      .pipe(map((response) => (response.requests ?? []).map(mapRequest)));
  }

  getById(id: number) {
    return this.api.get<{ request: unknown }>(`/requests/${id}`).pipe(map((response) => mapRequest(response.request)));
  }

  create(payload: RequestFormValue) {
    return this.api
      .post<{ request: unknown }>('/requests', mapRequestFormToApi(payload))
      .pipe(map((response) => mapRequest(response.request)));
  }

  update(id: number, payload: RequestFormValue) {
    return this.api
      .put<{ request: unknown }>(`/requests/${id}`, mapRequestFormToApi(payload))
      .pipe(map((response) => mapRequest(response.request)));
  }

  approve(id: number, payload: RequestApprovalFormValue) {
    return this.api
      .post<{ request: unknown }>(`/requests/${id}/approve`, mapRequestApprovalFormToApi(payload))
      .pipe(map((response) => mapRequest(response.request)));
  }

  cancel(id: number, payload: RequestCancelFormValue) {
    return this.api
      .post<{ request: unknown }>(`/requests/${id}/cancel`, mapRequestCancelFormToApi(payload))
      .pipe(map((response) => mapRequest(response.request)));
  }

  remove(id: number) {
    return this.api.delete<{ request: unknown }>(`/requests/${id}`).pipe(map((response) => mapRequest(response.request)));
  }
}
