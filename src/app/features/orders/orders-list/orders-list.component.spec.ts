import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { ClientsService } from '../../../core/services/clients.service';
import { EquipmentsService } from '../../../core/services/equipments.service';
import { OrdersService } from '../../../core/services/orders.service';
import { UsersService } from '../../../core/services/users.service';
import { OrdersListComponent } from './orders-list.component';

describe('OrdersListComponent', () => {
  let fixture: any;
  let component: OrdersListComponent;
  let ordersService: jasmine.SpyObj<OrdersService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    ordersService = jasmine.createSpyObj<OrdersService>('OrdersService', ['getAll', 'assign', 'start', 'complete', 'cancel']);
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['canAccess', 'role', 'user']);
    authService.canAccess.and.returnValue(true);
    authService.role.and.returnValue('planeador');
    authService.user.and.returnValue({ id: 99, roleId: 3, roleName: 'planeador' } as any);

    await TestBed.configureTestingModule({
      imports: [OrdersListComponent],
      providers: [
        provideRouter([]),
        { provide: OrdersService, useValue: ordersService },
        { provide: AuthService, useValue: authService },
        { provide: ClientsService, useValue: { getAll: () => of([]) } },
        { provide: EquipmentsService, useValue: { getAll: () => of([]) } },
        {
          provide: UsersService,
          useValue: {
            getAll: () =>
              of([
                { id: 4, username: 'tec', firstName: 'Tec', lastName: 'Uno', email: '', clientId: null, clientName: null, roleId: 4, roleName: 'tecnico', status: 'active' },
                { id: 5, username: 'sol', firstName: 'Sol', lastName: 'Dos', email: '', clientId: null, clientName: null, roleId: 2, roleName: 'solicitante', status: 'active' },
              ]),
          },
        },
      ],
    }).compileComponents();

    ordersService.getAll.and.returnValue(of([]));
    fixture = TestBed.createComponent(OrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('carga solo tecnicos en el catalogo de asignacion', () => {
    expect(component.technicians.map((user) => user.id)).toEqual([4]);
  });

  it('no asigna si el id del tecnico no es numerico', () => {
    spyOn(window, 'prompt').and.returnValues('abc');

    component.assignOrder({ id: 10, assignedUserId: null, plannedStartAt: null } as any);

    expect(ordersService.assign).not.toHaveBeenCalled();
  });

  it('completa una orden con los datos pedidos por el flujo operativo', () => {
    ordersService.complete.and.returnValue(of({} as any));
    spyOn(component, 'loadOrders');
    spyOn(window, 'prompt').and.returnValues(
      'Trabajo realizado',
      '5',
      '2026-03-25T11:00',
      'Cierre',
      'Diagnostico',
      'si'
    );

    component.completeOrder({
      id: 10,
      workedHours: null,
      finishedAt: null,
      closureNotes: null,
      diagnosis: null,
      receivedSatisfaction: null,
    } as any);

    expect(ordersService.complete).toHaveBeenCalledWith(10, {
      finishedAt: '2026-03-25T11:00',
      workedHours: 5,
      workDescription: 'Trabajo realizado',
      closureNotes: 'Cierre',
      diagnosis: 'Diagnostico',
      receivedSatisfaction: true,
    });
    expect(component.loadOrders).toHaveBeenCalled();
  });

  it('bloquea start y complete para un tecnico no asignado', () => {
    authService.role.and.returnValue('tecnico');
    authService.user.and.returnValue({ id: 4, roleId: 4, roleName: 'tecnico' } as any);

    expect(component.canStartOrder({ id: 10, status: 'assigned', assignedUserId: 7 } as any)).toBeFalse();
    expect(component.canCompleteOrder({ id: 10, status: 'in_progress', assignedUserId: 7 } as any)).toBeFalse();
  });

  it('solo permite asignar ordenes en estado assigned', () => {
    expect(component.canAssignOrder({ id: 10, status: 'assigned' } as any)).toBeTrue();
    expect(component.canAssignOrder({ id: 10, status: 'in_progress' } as any)).toBeFalse();
  });

  it('renderiza acciones segun estado operativo de la orden', () => {
    component.orders = [
      { id: 10, status: 'assigned', assignedUserId: 4, requestSummary: 'R1' } as any,
      { id: 11, status: 'in_progress', assignedUserId: 4, requestSummary: 'R2' } as any,
      { id: 12, status: 'completed', assignedUserId: 4, requestSummary: 'R3' } as any,
    ];

    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Asignar');
    expect(text).toContain('Iniciar');
    expect(text).toContain('Completar');
    expect(text).toContain('Ver');
  });
});
