import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { mapRequest, mapRequestFormToApi } from '../mappers/domain.mappers';
import { RequestFormValue } from '../models/domain.models';

@Injectable({ providedIn: 'root' })
export class RequestsService {
  private readonly api = inject(ApiClientService);

  getAll() {
    return this.api.get<{ requests: unknown[] }>('/requests').pipe(map((response) => (response.requests ?? []).map(mapRequest)));
  }

  getById(id: number) {
    return this.api.get<{ request: unknown }>(`/requests/${id}`).pipe(map((response) => mapRequest(response.request)));
  }

  create(payload: RequestFormValue) {
    return this.api.post<{ request: unknown }>('/requests', mapRequestFormToApi(payload)).pipe(map((response) => mapRequest(response.request)));
  }

  update(id: number, payload: RequestFormValue) {
    return this.api.put<{ request: unknown }>(`/requests/${id}`, mapRequestFormToApi(payload)).pipe(map((response) => mapRequest(response.request)));
  }

  remove(id: number) {
    return this.api.delete<{ request: unknown }>(`/requests/${id}`).pipe(map((response) => mapRequest(response.request)));
  }
}
