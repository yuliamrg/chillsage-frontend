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

  beforeEach(async () => {
    ordersService = jasmine.createSpyObj<OrdersService>('OrdersService', ['getAll', 'assign', 'start', 'complete', 'cancel']);

    await TestBed.configureTestingModule({
      imports: [OrdersListComponent],
      providers: [
        provideRouter([]),
        { provide: OrdersService, useValue: ordersService },
        { provide: AuthService, useValue: jasmine.createSpyObj<AuthService>('AuthService', ['canAccess']) },
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
});
