import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { mapOrder, mapOrderFormToApi } from '../mappers/domain.mappers';
import { OrderFormValue } from '../models/domain.models';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly api = inject(ApiClientService);

  getAll() {
    return this.api.get<{ orders: unknown[] }>('/orders').pipe(map((response) => (response.orders ?? []).map(mapOrder)));
  }

  getById(id: number) {
    return this.api.get<{ order: unknown }>(`/orders/${id}`).pipe(map((response) => mapOrder(response.order)));
  }

  create(payload: OrderFormValue) {
    return this.api.post<{ order: unknown }>('/orders', mapOrderFormToApi(payload)).pipe(map((response) => mapOrder(response.order)));
  }

  update(id: number, payload: OrderFormValue) {
    return this.api.put<{ order: unknown }>(`/orders/${id}`, mapOrderFormToApi(payload)).pipe(map((response) => mapOrder(response.order)));
  }

  remove(id: number) {
    return this.api.delete<{ order: unknown }>(`/orders/${id}`).pipe(map((response) => mapOrder(response.order)));
  }
}
