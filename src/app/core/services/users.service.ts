import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { DEFAULT_LOOKUP_LIMIT, mapPaginatedCollectionResponse } from '../api/pagination.utils';
import { ApiClientService } from '../api/api-client.service';
import { mapUser, mapUserFormToApi } from '../mappers/domain.mappers';
import { CollectionQuery, UserFormValue } from '../models/domain.models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly api = inject(ApiClientService);

  list(query?: CollectionQuery) {
    return this.api
      .get<{ users: unknown[]; meta?: unknown }>('/users', {
        page: query?.page,
        limit: query?.limit,
        sort: query?.sort,
      })
      .pipe(map((response) => mapPaginatedCollectionResponse(response, 'users', mapUser)));
  }

  getAll() {
    return this.list({ limit: DEFAULT_LOOKUP_LIMIT }).pipe(map((response) => response.items));
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
