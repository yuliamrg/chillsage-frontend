import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { DEFAULT_LOOKUP_LIMIT, mapPaginatedCollectionResponse } from '../api/pagination.utils';
import {
  mapOrder,
  mapOrderAssignFormToApi,
  mapOrderCancelFormToApi,
  mapOrderCompleteFormToApi,
  mapOrderFormToApi,
  mapOrderStartFormToApi,
} from '../mappers/domain.mappers';
import {
  CollectionQuery,
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

  list(query?: OrderFilters & CollectionQuery) {
    return this.api
      .get<{ orders: unknown[]; meta?: unknown }>('/orders', {
        client_id: query?.clientId,
        equipment_id: query?.equipmentId,
        assigned_user_id: query?.assignedUserId,
        status: query?.status,
        type: query?.type,
        date_from: query?.dateFrom,
        date_to: query?.dateTo,
        page: query?.page,
        limit: query?.limit,
        sort: query?.sort,
      })
      .pipe(map((response) => mapPaginatedCollectionResponse(response, 'orders', mapOrder)));
  }

  getAll(filters?: OrderFilters) {
    return this.list({ ...filters, limit: DEFAULT_LOOKUP_LIMIT }).pipe(map((response) => response.items));
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
