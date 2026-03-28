import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { SchedulesService } from './schedules.service';

describe('SchedulesService', () => {
  let service: SchedulesService;
  let api: jasmine.SpyObj<ApiClientService>;

  beforeEach(() => {
    api = jasmine.createSpyObj<ApiClientService>('ApiClientService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        SchedulesService,
        { provide: ApiClientService, useValue: api },
      ],
    });

    service = TestBed.inject(SchedulesService);
  });

  it('consulta schedules paginados con filtros y mapea la respuesta', () => {
    api.get.and.returnValue(
      of({
        schedules: [
          {
            id: 8,
            client_id: 3,
            client_name: 'Cliente Demo',
            name: 'Preventivo marzo',
            type: 'preventive',
            scheduled_date: '2026-03-28T00:00:00.000Z',
            description: 'Mantenimiento mensual',
            status: 'unassigned',
            equipment_ids: [22],
            equipments: [{ id: 22, name: 'Chiller piso 3', code: 'EQ-003' }],
          },
        ],
        meta: {
          pagination: {
            page: 3,
            limit: 5,
            total: 12,
            total_pages: 3,
            returned: 1,
            has_next_page: false,
            has_previous_page: true,
          },
        },
      })
    );

    let result: any;
    service.list({ clientId: 3, status: 'unassigned', type: 'preventive', page: 3, limit: 5 }).subscribe((value) => (result = value));

    expect(api.get).toHaveBeenCalledWith('/schedules', {
      client_id: 3,
      status: 'unassigned',
      type: 'preventive',
      date_from: undefined,
      date_to: undefined,
      page: 3,
      limit: 5,
      sort: undefined,
    });
    expect(result.pagination.total).toBe(12);
    expect(result.items[0]).toEqual(
      jasmine.objectContaining({
        id: 8,
        clientId: 3,
        status: 'unassigned',
        equipmentIds: [22],
      })
    );
  });

  it('envia acciones open y close con body vacio', () => {
    api.post.and.returnValues(
      of({ schedule: { id: 8, name: 'Preventivo marzo', type: 'preventive', description: '', status: 'open', equipment_ids: [] } }),
      of({ schedule: { id: 8, name: 'Preventivo marzo', type: 'preventive', description: '', status: 'closed', equipment_ids: [] } })
    );

    service.open(8, {}).subscribe();
    service.close(8, {}).subscribe();

    expect(api.post.calls.argsFor(0)).toEqual(['/schedules/8/open', {}]);
    expect(api.post.calls.argsFor(1)).toEqual(['/schedules/8/close', {}]);
  });
});
