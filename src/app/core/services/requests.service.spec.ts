import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { RequestsService } from './requests.service';

describe('RequestsService', () => {
  let service: RequestsService;
  let api: jasmine.SpyObj<ApiClientService>;

  beforeEach(() => {
    api = jasmine.createSpyObj<ApiClientService>('ApiClientService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        RequestsService,
        { provide: ApiClientService, useValue: api },
      ],
    });

    service = TestBed.inject(RequestsService);
  });

  it('consulta requests paginados con filtros y mapea la respuesta', () => {
    api.get.and.returnValue(
      of({
        requests: [
          {
            id: 9,
            client_id: 3,
            client_name: 'Cliente Demo',
            requester_user_id: 7,
            requester_name: 'Ana Perez',
            equipment_id: 11,
            equipment_name: 'Chiller 1',
            equipment_code: 'EQ-11',
            type: 'corrective',
            title: 'Fuga',
            description: 'Revisar presion',
            priority: 'high',
            status: 'approved',
            requested_at: '2026-03-20T10:00:00.000Z',
            order_id: 12,
            order_status: 'assigned',
            created_at: '2026-03-20T10:00:00.000Z',
            updated_at: '2026-03-20T10:30:00.000Z',
          },
        ],
        meta: {
          pagination: {
            page: 2,
            limit: 10,
            total: 42,
            total_pages: 5,
            returned: 1,
            has_next_page: true,
            has_previous_page: true,
          },
        },
      })
    );

    let result: any;
    service
      .list({ clientId: 3, requesterUserId: 7, equipmentId: 11, status: 'approved', type: 'corrective', page: 2, limit: 10 })
      .subscribe((value) => (result = value));

    expect(api.get).toHaveBeenCalledWith('/requests', {
      client_id: 3,
      requester_user_id: 7,
      equipment_id: 11,
      status: 'approved',
      type: 'corrective',
      date_from: undefined,
      date_to: undefined,
      page: 2,
      limit: 10,
      sort: undefined,
    });
    expect(result.pagination.total).toBe(42);
    expect(result.items[0]).toEqual(
      jasmine.objectContaining({
        id: 9,
        clientId: 3,
        requesterUserId: 7,
        equipmentId: 11,
        status: 'approved',
        orderId: 12,
      })
    );
  });

  it('envia approve con el payload del contrato', () => {
    api.post.and.returnValue(
      of({
        request: {
          id: 9,
          client_id: 3,
          type: 'corrective',
          title: 'Fuga',
          description: 'Revisar presion',
          priority: 'high',
          status: 'approved',
          review_notes: 'Aprobada por planeacion',
        },
      })
    );

    let result: any;
    service.approve(9, { reviewNotes: 'Aprobada por planeacion' }).subscribe((value) => (result = value));

    expect(api.post).toHaveBeenCalledWith('/requests/9/approve', {
      review_notes: 'Aprobada por planeacion',
    });
    expect(result.status).toBe('approved');
    expect(result.reviewNotes).toBe('Aprobada por planeacion');
  });
});
