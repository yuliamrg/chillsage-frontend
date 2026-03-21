import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { mapUser, mapUserFormToApi } from '../mappers/domain.mappers';
import { UserFormValue } from '../models/domain.models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly api = inject(ApiClientService);

  getAll() {
    return this.api.get<{ users: unknown[] }>('/users').pipe(map((response) => (response.users ?? []).map(mapUser)));
  }

  getById(id: number) {
    return this.api.get<{ user: unknown }>(`/users/${id}`).pipe(map((response) => mapUser(response.user)));
  }

  create(payload: UserFormValue) {
    return this.api.post<{ user: unknown }>('/users', mapUserFormToApi(payload)).pipe(map((response) => mapUser(response.user)));
  }

  update(id: number, payload: UserFormValue) {
    return this.api.put<{ user: unknown }>(`/users/${id}`, mapUserFormToApi(payload)).pipe(map((response) => mapUser(response.user)));
  }

  remove(id: number) {
    return this.api.delete<{ user: unknown }>(`/users/${id}`).pipe(map((response) => mapUser(response.user)));
  }
}
