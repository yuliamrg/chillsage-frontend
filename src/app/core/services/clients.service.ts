import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { mapClient, mapClientFormToApi } from '../mappers/domain.mappers';
import { ClientFormValue, ClientVm } from '../models/domain.models';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private readonly api = inject(ApiClientService);

  getAll() {
    return this.api.get<{ clients: unknown[] }>('/clients').pipe(map((response) => (response.clients ?? []).map(mapClient)));
  }

  getById(id: number) {
    return this.api.get<{ client: unknown }>(`/clients/${id}`).pipe(map((response) => mapClient(response.client)));
  }

  create(payload: ClientFormValue) {
    return this.api.post<{ client: unknown }>('/clients', mapClientFormToApi(payload)).pipe(map((response) => mapClient(response.client)));
  }

  update(id: number, payload: ClientFormValue) {
    return this.api.put<{ client: unknown }>(`/clients/${id}`, mapClientFormToApi(payload)).pipe(map((response) => mapClient(response.client)));
  }

  remove(id: number) {
    return this.api.delete<{ client: unknown }>(`/clients/${id}`).pipe(map((response) => mapClient(response.client)));
  }
}
