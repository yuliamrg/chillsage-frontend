import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { DEFAULT_LOOKUP_LIMIT, mapPaginatedCollectionResponse } from '../api/pagination.utils';
import { ApiClientService } from '../api/api-client.service';
import { mapClient, mapClientFormToApi } from '../mappers/domain.mappers';
import { ClientFormValue, CollectionQuery } from '../models/domain.models';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private readonly api = inject(ApiClientService);

  list(query?: CollectionQuery) {
    return this.api
      .get<{ clients: unknown[]; meta?: unknown }>('/clients', {
        page: query?.page,
        limit: query?.limit,
        sort: query?.sort,
      })
      .pipe(map((response) => mapPaginatedCollectionResponse(response, 'clients', mapClient)));
  }

  getAll() {
    return this.list({ limit: DEFAULT_LOOKUP_LIMIT }).pipe(map((response) => response.items));
  }

  getById(id: number) {
    return this.api.get<{ client: unknown }>(`/clients/${id}`).pipe(map((response) => mapClient(response.client)));
  }

  create(payload: ClientFormValue) {
    return this.api.post<{ client: unknown }>('/clients', mapClientFormToApi(payload)).pipe(map((response) => mapClient(response.client)));
  }

  update(id: number, payload: Partial<ClientFormValue>) {
    return this.api.put<{ client: unknown }>(`/clients/${id}`, mapClientFormToApi(payload)).pipe(map((response) => mapClient(response.client)));
  }

  remove(id: number) {
    return this.api.delete<{ client: unknown }>(`/clients/${id}`).pipe(map((response) => mapClient(response.client)));
  }
}
