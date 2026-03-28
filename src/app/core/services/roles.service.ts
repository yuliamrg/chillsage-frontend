import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { DEFAULT_LOOKUP_LIMIT, mapPaginatedCollectionResponse } from '../api/pagination.utils';
import { mapRole } from '../mappers/domain.mappers';
import { CollectionQuery } from '../models/domain.models';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private readonly api = inject(ApiClientService);

  list(query?: CollectionQuery) {
    return this.api
      .get<{ roles: unknown[]; meta?: unknown }>('/roles', {
        page: query?.page,
        limit: query?.limit,
        sort: query?.sort,
      })
      .pipe(map((response) => mapPaginatedCollectionResponse(response, 'roles', mapRole)));
  }

  getAll() {
    return this.list({ limit: DEFAULT_LOOKUP_LIMIT }).pipe(map((response) => response.items));
  }
}
