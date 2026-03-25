import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { ClientsService } from '../../../core/services/clients.service';
import { EquipmentsService } from '../../../core/services/equipments.service';
import { RequestsService } from '../../../core/services/requests.service';
import { UsersService } from '../../../core/services/users.service';
import { RequestsListComponent } from './requests-list.component';

describe('RequestsListComponent', () => {
  let fixture: any;
  let component: RequestsListComponent;
  let requestsService: jasmine.SpyObj<RequestsService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    requestsService = jasmine.createSpyObj<RequestsService>('RequestsService', ['getAll', 'approve', 'cancel', 'remove']);
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['canAccess']);

    await TestBed.configureTestingModule({
      imports: [RequestsListComponent],
      providers: [
        provideRouter([]),
        { provide: RequestsService, useValue: requestsService },
        { provide: AuthService, useValue: authService },
        { provide: ClientsService, useValue: { getAll: () => of([{ id: 1, name: 'Cliente', address: '', phone: '', email: '', description: '', status: 'active' }]) } },
        { provide: UsersService, useValue: { getAll: () => of([{ id: 2, username: 'ana', firstName: 'Ana', lastName: 'Perez', email: '', clientId: 1, clientName: 'Cliente', roleId: 2, roleName: 'solicitante', status: 'active' }]) } },
        { provide: EquipmentsService, useValue: { getAll: () => of([{ id: 3, name: 'Equipo', type: 'chiller', location: '', brand: '', model: '', serial: '', fixedAssetCode: '', alias: '', clientId: 1, clientName: 'Cliente', observations: '', status: 'active' }]) } },
      ],
    }).compileComponents();

    requestsService.getAll.and.returnValue(of([]));
    authService.canAccess.and.returnValue(true);
    fixture = TestBed.createComponent(RequestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('carga catalogos y solicitudes al iniciar', () => {
    expect(requestsService.getAll).toHaveBeenCalledWith(component.filters);
    expect(component.clients.length).toBe(1);
    expect(component.requesters.length).toBe(1);
    expect(component.equipments.length).toBe(1);
  });

  it('restablece filtros y recarga la lista', () => {
    component.filters = {
      clientId: 1,
      requesterUserId: 2,
      equipmentId: 3,
      status: 'pending',
      type: 'corrective',
      dateFrom: '2026-03-01',
      dateTo: '2026-03-30',
    };

    component.clearFilters();

    expect(component.filters).toEqual({
      clientId: null,
      requesterUserId: null,
      equipmentId: null,
      status: null,
      type: null,
      dateFrom: null,
      dateTo: null,
    });
    expect(requestsService.getAll).toHaveBeenCalledTimes(2);
  });

  it('aprueba una solicitud con las notas ingresadas', () => {
    requestsService.approve.and.returnValue(of({} as any));
    spyOn(window, 'prompt').and.returnValue('Notas aprobacion');
    spyOn(component, 'loadRequests');

    component.approveRequest({
      id: 10,
      reviewNotes: null,
    } as any);

    expect(requestsService.approve).toHaveBeenCalledWith(10, { reviewNotes: 'Notas aprobacion' });
    expect(component.loadRequests).toHaveBeenCalled();
  });

  it('no anula la solicitud si no se informa motivo', () => {
    spyOn(window, 'prompt').and.returnValue('');

    component.cancelRequest({ id: 10, reviewNotes: null } as any);

    expect(requestsService.cancel).not.toHaveBeenCalled();
  });

  it('solo permite editar solicitudes pending', () => {
    expect(component.canEditRequest({ id: 10, status: 'pending' } as any)).toBeTrue();
    expect(component.canEditRequest({ id: 10, status: 'approved' } as any)).toBeFalse();
  });

  it('solo permite crear orden para solicitudes approved sin orden asociada', () => {
    expect(component.canCreateOrder({ id: 10, status: 'approved', orderId: null } as any)).toBeTrue();
    expect(component.canCreateOrder({ id: 10, status: 'approved', orderId: 22 } as any)).toBeFalse();
    expect(component.canCreateOrder({ id: 10, status: 'pending', orderId: null } as any)).toBeFalse();
  });
});
