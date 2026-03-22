import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import {
  mapOrder,
  mapOrderAssignFormToApi,
  mapOrderCancelFormToApi,
  mapOrderCompleteFormToApi,
  mapOrderFormToApi,
  mapOrderStartFormToApi,
} from '../mappers/domain.mappers';
import {
  OrderAssignFormValue,
  OrderCancelFormValue,
  OrderCompleteFormValue,
  OrderFilters,
  OrderFormValue,
  OrderStartFormValue,
} from '../models/domain.models';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly api = inject(ApiClientService);

  getAll(filters?: OrderFilters) {
    return this.api
      .get<{ orders: unknown[] }>('/orders', {
        client_id: filters?.clientId,
        equipment_id: filters?.equipmentId,
        assigned_user_id: filters?.assignedUserId,
        status: filters?.status,
        type: filters?.type,
        date_from: filters?.dateFrom,
        date_to: filters?.dateTo,
      })
      .pipe(map((response) => (response.orders ?? []).map(mapOrder)));
  }

  getById(id: number) {
    return this.api.get<{ order: unknown }>(`/orders/${id}`).pipe(map((response) => mapOrder(response.order)));
  }

  create(payload: OrderFormValue) {
    return this.api
      .post<{ order: unknown }>('/orders', mapOrderFormToApi(payload))
      .pipe(map((response) => mapOrder(response.order)));
  }

  update(id: number, payload: OrderFormValue) {
    return this.api
      .put<{ order: unknown }>(`/orders/${id}`, mapOrderFormToApi(payload))
      .pipe(map((response) => mapOrder(response.order)));
  }

  assign(id: number, payload: OrderAssignFormValue) {
    return this.api
      .post<{ order: unknown }>(`/orders/${id}/assign`, mapOrderAssignFormToApi(payload))
      .pipe(map((response) => mapOrder(response.order)));
  }

  start(id: number, payload: OrderStartFormValue) {
    return this.api
      .post<{ order: unknown }>(`/orders/${id}/start`, mapOrderStartFormToApi(payload))
      .pipe(map((response) => mapOrder(response.order)));
  }

  complete(id: number, payload: OrderCompleteFormValue) {
    return this.api
      .post<{ order: unknown }>(`/orders/${id}/complete`, mapOrderCompleteFormToApi(payload))
      .pipe(map((response) => mapOrder(response.order)));
  }

  cancel(id: number, payload: OrderCancelFormValue) {
    return this.api
      .post<{ order: unknown }>(`/orders/${id}/cancel`, mapOrderCancelFormToApi(payload))
      .pipe(map((response) => mapOrder(response.order)));
  }

  remove(id: number) {
    return this.api.delete<{ order: unknown }>(`/orders/${id}`).pipe(map((response) => mapOrder(response.order)));
  }
}
