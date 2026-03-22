import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let api: jasmine.SpyObj<ApiClientService>;

  beforeEach(() => {
    api = jasmine.createSpyObj<ApiClientService>('ApiClientService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        OrdersService,
        { provide: ApiClientService, useValue: api },
      ],
    });

    service = TestBed.inject(OrdersService);
  });

  it('consulta orders con filtros y mapea la respuesta', () => {
    api.get.and.returnValue(
      of({
        orders: [
          {
            id: 14,
            request_id: 9,
            request_status: 'approved',
            client_id: 3,
            client_name: 'Cliente Demo',
            equipment_id: 11,
            equipment_name: 'Chiller 1',
            equipment_code: 'EQ-11',
            assigned_user_id: 21,
            assigned_user_name: 'Carlos Ruiz',
            type: 'corrective',
            status: 'assigned',
            planned_start_at: '2026-03-25T09:00:00.000Z',
            created_at: '2026-03-22T10:00:00.000Z',
            updated_at: '2026-03-22T10:30:00.000Z',
          },
        ],
      })
    );

    let result: any[] = [];
    service
      .getAll({ clientId: 3, equipmentId: 11, assignedUserId: 21, status: 'assigned', type: 'corrective' })
      .subscribe((value) => (result = value));

    expect(api.get).toHaveBeenCalledWith('/orders', {
      client_id: 3,
      equipment_id: 11,
      assigned_user_id: 21,
      status: 'assigned',
      type: 'corrective',
      date_from: undefined,
      date_to: undefined,
    });
    expect(result[0]).toEqual(
      jasmine.objectContaining({
        id: 14,
        requestId: 9,
        assignedUserId: 21,
        status: 'assigned',
      })
    );
  });

  it('envia complete con el payload operativo esperado', () => {
    api.post.and.returnValue(
      of({
        order: {
          id: 14,
          request_id: 9,
          type: 'corrective',
          status: 'completed',
          worked_hours: 4,
          work_description: 'Cambio de sello',
          closure_notes: 'Equipo estable',
          diagnosis: 'Sello desgastado',
          received_satisfaction: true,
          finished_at: '2026-03-25T14:00:00.000Z',
        },
      })
    );

    const finishedAt = '2026-03-25T09:00';
    let result: any;
    service
      .complete(14, {
        finishedAt,
        workedHours: 4,
        workDescription: 'Cambio de sello',
        closureNotes: 'Equipo estable',
        diagnosis: 'Sello desgastado',
        receivedSatisfaction: true,
      })
      .subscribe((value) => (result = value));

    expect(api.post).toHaveBeenCalledWith('/orders/14/complete', {
      finished_at: finishedAt,
      worked_hours: 4,
      work_description: 'Cambio de sello',
      closure_notes: 'Equipo estable',
      diagnosis: 'Sello desgastado',
      received_satisfaction: true,
    });
    expect(result.status).toBe('completed');
    expect(result.workedHours).toBe(4);
  });
});
