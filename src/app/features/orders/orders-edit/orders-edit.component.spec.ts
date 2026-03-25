import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { OrdersService } from '../../../core/services/orders.service';
import { RequestsService } from '../../../core/services/requests.service';
import { UsersService } from '../../../core/services/users.service';
import { OrdersEditComponent } from './orders-edit.component';

describe('OrdersEditComponent', () => {
  let fixture: any;
  let component: OrdersEditComponent;
  let ordersService: jasmine.SpyObj<OrdersService>;
  let router: Router;

  beforeEach(async () => {
    ordersService = jasmine.createSpyObj<OrdersService>('OrdersService', ['getById', 'update']);
    ordersService.getById.and.returnValue(
      of({
        id: 14,
        requestId: 9,
        assignedUserId: 4,
        plannedStartAt: '2026-03-25T08:00',
        diagnosis: 'Pendiente',
        closureNotes: '',
        receivedSatisfaction: null,
        status: 'assigned',
      } as any)
    );

    await TestBed.configureTestingModule({
      imports: [OrdersEditComponent],
      providers: [
        provideRouter([]),
        { provide: OrdersService, useValue: ordersService },
        { provide: RequestsService, useValue: { getAll: () => of([{ id: 9, title: 'Solicitud', status: 'approved', orderId: null }]) } },
        { provide: UsersService, useValue: { getAll: () => of([{ id: 4, username: 'tec', firstName: 'Tec', lastName: 'Uno', email: '', clientId: null, clientName: null, roleId: 4, roleName: 'tecnico', status: 'active' }]) } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '14' } } } },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
    ordersService.update.and.returnValue(of({} as any));
    fixture = TestBed.createComponent(OrdersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('actualiza la orden cuando sigue editable', () => {
    component.submit();

    expect(ordersService.update).toHaveBeenCalledWith(14, jasmine.objectContaining({ requestId: 9 }));
  });

  it('redirige al detalle si la orden ya no es editable', async () => {
    ordersService.getById.and.returnValue(
      of({
        id: 14,
        requestId: 9,
        assignedUserId: 4,
        plannedStartAt: '2026-03-25T08:00',
        diagnosis: 'Pendiente',
        closureNotes: '',
        receivedSatisfaction: null,
        status: 'completed',
      } as any)
    );

    fixture = TestBed.createComponent(OrdersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    await Promise.resolve();

    expect(router.navigate).toHaveBeenCalledWith(['/orders/detail', 14], {
      state: { errorMessage: 'La orden ya no se puede editar porque su estado actual es solo lectura.' },
    });
  });
});
