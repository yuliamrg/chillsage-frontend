import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { DEFAULT_LOOKUP_LIMIT, mapPaginatedCollectionResponse } from '../api/pagination.utils';
import {
  mapRequest,
  mapRequestApprovalFormToApi,
  mapRequestCancelFormToApi,
  mapRequestFormToApi,
} from '../mappers/domain.mappers';
import {
  CollectionQuery,
  RequestApprovalFormValue,
  RequestCancelFormValue,
  RequestFilters,
  RequestFormValue,
} from '../models/domain.models';

@Injectable({ providedIn: 'root' })
export class RequestsService {
  private readonly api = inject(ApiClientService);

  list(query?: RequestFilters & CollectionQuery) {
    return this.api
      .get<{ requests: unknown[]; meta?: unknown }>('/requests', {
        client_id: query?.clientId,
        requester_user_id: query?.requesterUserId,
        equipment_id: query?.equipmentId,
        status: query?.status,
        type: query?.type,
        date_from: query?.dateFrom,
        date_to: query?.dateTo,
        page: query?.page,
        limit: query?.limit,
        sort: query?.sort,
      })
      .pipe(map((response) => mapPaginatedCollectionResponse(response, 'requests', mapRequest)));
  }

  getAll(filters?: RequestFilters) {
    return this.list({ ...filters, limit: DEFAULT_LOOKUP_LIMIT }).pipe(map((response) => response.items));
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
