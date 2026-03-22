import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { OrdersService } from '../../../core/services/orders.service';
import { RequestsService } from '../../../core/services/requests.service';
import { UsersService } from '../../../core/services/users.service';
import { OrdersCreateComponent } from './orders-create.component';

describe('OrdersCreateComponent', () => {
  let fixture: any;
  let component: OrdersCreateComponent;
  let ordersService: jasmine.SpyObj<OrdersService>;
  let requestsService: jasmine.SpyObj<RequestsService>;
  let router: Router;

  beforeEach(async () => {
    ordersService = jasmine.createSpyObj<OrdersService>('OrdersService', ['create']);
    requestsService = jasmine.createSpyObj<RequestsService>('RequestsService', ['getAll']);
    requestsService.getAll.and.returnValue(
      of([
        { id: 9, orderId: null, status: 'approved' },
        { id: 10, orderId: 20, status: 'approved' },
      ] as any)
    );

    await TestBed.configureTestingModule({
      imports: [OrdersCreateComponent],
      providers: [
        provideRouter([]),
        { provide: OrdersService, useValue: ordersService },
        { provide: RequestsService, useValue: requestsService },
        {
          provide: UsersService,
          useValue: {
            getAll: () =>
              of([
                { id: 4, username: 'tec', firstName: 'Tec', lastName: 'Uno', email: '', clientId: null, clientName: null, roleId: 4, roleName: 'tecnico', status: 'active' },
                { id: 5, username: 'pla', firstName: 'Pla', lastName: 'Dos', email: '', clientId: null, clientName: null, roleId: 3, roleName: 'planeador', status: 'active' },
              ]),
          },
        },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => '9' } } } },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
    ordersService.create.and.returnValue(of({} as any));
    fixture = TestBed.createComponent(OrdersCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('carga solicitudes aprobadas sin orden y preselecciona requestId', () => {
    expect(requestsService.getAll).toHaveBeenCalledWith({ status: 'approved' });
    expect(component.requests.map((request) => request.id)).toEqual([9]);
    expect(component.technicians.map((user) => user.id)).toEqual([4]);
    expect(component.form.requestId).toBe(9);
  });

  it('crea la orden y navega a la lista', () => {
    component.form = {
      requestId: 9,
      assignedUserId: 4,
      plannedStartAt: '2026-03-25T08:00',
      diagnosis: 'Inicial',
      closureNotes: '',
      receivedSatisfaction: null,
    };

    component.submit();

    expect(ordersService.create).toHaveBeenCalledWith(component.form);
    expect(router.navigate).toHaveBeenCalledWith(['/orders/list']);
  });
});
