import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { mapRole } from '../mappers/domain.mappers';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private readonly api = inject(ApiClientService);

  getAll() {
    return this.api.get<{ roles: unknown[] }>('/roles').pipe(map((response) => (response.roles ?? []).map(mapRole)));
  }
}
