import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { OrdersService } from '../../../core/services/orders.service';
import { OrdersDetailComponent } from './orders-detail.component';

describe('OrdersDetailComponent', () => {
  let fixture: any;
  let component: OrdersDetailComponent;
  let ordersService: jasmine.SpyObj<OrdersService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    ordersService = jasmine.createSpyObj<OrdersService>('OrdersService', ['getById', 'start', 'complete', 'cancel']);
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['canAccess', 'role', 'user']);
    authService.canAccess.and.returnValue(true);
    authService.role.and.returnValue('planeador');
    authService.user.and.returnValue({ id: 99, roleId: 3, roleName: 'planeador' } as any);
    ordersService.getById.and.returnValue(
      of({
        id: 14,
        status: 'assigned',
        assignedUserId: 4,
        workedHours: null,
        finishedAt: null,
        closureNotes: null,
        diagnosis: null,
        receivedSatisfaction: null,
      } as any)
    );

    await TestBed.configureTestingModule({
      imports: [OrdersDetailComponent],
      providers: [
        provideRouter([]),
        { provide: OrdersService, useValue: ordersService },
        { provide: AuthService, useValue: authService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '14' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('carga la orden desde la ruta', () => {
    expect(ordersService.getById).toHaveBeenCalledWith(14);
    expect(component.order?.id).toBe(14);
  });

  it('inicia la orden con la fecha indicada', () => {
    ordersService.start.and.returnValue(of({ id: 14, status: 'in_progress' } as any));
    spyOn(window, 'prompt').and.returnValue('2026-03-25T08:00');

    component.startOrder();

    expect(ordersService.start).toHaveBeenCalledWith(14, { startedAt: '2026-03-25T08:00' });
    expect(component.order?.status).toBe('in_progress');
  });

  it('no completa la orden si faltan datos obligatorios', () => {
    spyOn(window, 'prompt').and.returnValues('', 'NaN');

    component.completeOrder();

    expect(ordersService.complete).not.toHaveBeenCalled();
  });

  it('anula la orden cuando existe motivo', () => {
    ordersService.cancel.and.returnValue(of({ id: 14, status: 'cancelled' } as any));
    spyOn(window, 'prompt').and.returnValue('Sin acceso');

    component.cancelOrder();

    expect(ordersService.cancel).toHaveBeenCalledWith(14, { cancelReason: 'Sin acceso' });
    expect(component.order?.status).toBe('cancelled');
  });

  it('bloquea iniciar para tecnico no asignado', () => {
    authService.role.and.returnValue('tecnico');
    authService.user.and.returnValue({ id: 8, roleId: 4, roleName: 'tecnico' } as any);

    component.startOrder();

    expect(ordersService.start).not.toHaveBeenCalled();
  });

  it('oculta acciones de tecnico cuando la orden no le pertenece', () => {
    authService.role.and.returnValue('tecnico');
    authService.user.and.returnValue({ id: 8, roleId: 4, roleName: 'tecnico' } as any);

    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).not.toContain('Iniciar');
    expect(text).toContain('Anular');
  });
});
