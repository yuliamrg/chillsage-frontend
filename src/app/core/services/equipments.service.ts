import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { DEFAULT_LOOKUP_LIMIT, mapPaginatedCollectionResponse } from '../api/pagination.utils';
import { ApiClientService } from '../api/api-client.service';
import { mapEquipment, mapEquipmentFormToApi } from '../mappers/domain.mappers';
import { CollectionQuery, EquipmentFormValue } from '../models/domain.models';

@Injectable({ providedIn: 'root' })
export class EquipmentsService {
  private readonly api = inject(ApiClientService);

  list(query?: CollectionQuery) {
    return this.api
      .get<{ equipments: unknown[]; meta?: unknown }>('/equipments', {
        page: query?.page,
        limit: query?.limit,
        sort: query?.sort,
      })
      .pipe(map((response) => mapPaginatedCollectionResponse(response, 'equipments', mapEquipment)));
  }

  getAll() {
    return this.list({ limit: DEFAULT_LOOKUP_LIMIT }).pipe(map((response) => response.items));
  }

  getById(id: number) {
    return this.api.get<{ equipment: unknown }>(`/equipments/${id}`).pipe(map((response) => mapEquipment(response.equipment)));
  }

  create(payload: EquipmentFormValue) {
    return this.api.post<{ equipment: unknown }>('/equipments', mapEquipmentFormToApi(payload)).pipe(map((response) => mapEquipment(response.equipment)));
  }

  update(id: number, payload: EquipmentFormValue) {
    return this.api.put<{ equipment: unknown }>(`/equipments/${id}`, mapEquipmentFormToApi(payload)).pipe(map((response) => mapEquipment(response.equipment)));
  }

  remove(id: number) {
    return this.api.delete<{ equipment: unknown }>(`/equipments/${id}`).pipe(map((response) => mapEquipment(response.equipment)));
  }
}
