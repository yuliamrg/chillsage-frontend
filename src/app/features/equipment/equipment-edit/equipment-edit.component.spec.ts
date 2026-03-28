import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { ClientsService } from '../../../core/services/clients.service';
import { EquipmentsService } from '../../../core/services/equipments.service';
import { EquipmentEditComponent } from './equipment-edit.component';

describe('EquipmentEditComponent', () => {
  let fixture: any;
  let component: EquipmentEditComponent;
  let router: Router;
  let authService: jasmine.SpyObj<AuthService>;
  let equipmentsService: jasmine.SpyObj<EquipmentsService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['role']);
    equipmentsService = jasmine.createSpyObj<EquipmentsService>('EquipmentsService', ['getById', 'update']);
    authService.role.and.returnValue('planeador' as any);
    equipmentsService.getById.and.returnValue(
      of({
        id: 3,
        name: 'Equipo base',
        type: 'cooling',
        location: 'Sala 1',
        brand: 'Carrier',
        model: 'X1',
        serial: 'SER-1',
        fixedAssetCode: 'EQ-1',
        alias: 'Alias',
        clientId: 8,
        clientName: 'Cliente',
        observations: 'Observacion',
        status: 'active',
        useStartAt: '2026-03-28T08:00:00.000Z',
        useEndAt: '2026-03-28T10:00:00.000Z',
      })
    );
    equipmentsService.update.and.returnValue(of({} as any));

    await TestBed.configureTestingModule({
      imports: [EquipmentEditComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '3' } } } },
        { provide: AuthService, useValue: authService },
        { provide: EquipmentsService, useValue: equipmentsService },
        {
          provide: ClientsService,
          useValue: { getAll: () => of([{ id: 8, name: 'Cliente', address: '', phone: '', email: '', description: '', status: 'active' }]) },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
    fixture = TestBed.createComponent(EquipmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('envia solo campos operativos cuando el actor es planeador', () => {
    component.form = {
      ...component.form,
      name: 'No debe enviarse',
      type: 'No debe enviarse',
      brand: 'No debe enviarse',
      model: 'No debe enviarse',
      serial: 'No debe enviarse',
      fixedAssetCode: 'No debe enviarse',
      clientId: 999,
      location: 'Nueva ubicacion',
      alias: 'Nuevo alias',
      observations: 'Nuevo detalle',
      status: 'maintenance',
      useStartAt: '2026-03-28T09:00',
      useEndAt: '2026-03-28T11:00',
    };

    component.submit();

    expect(equipmentsService.update).toHaveBeenCalled();
    const payload = equipmentsService.update.calls.mostRecent().args[1] as Record<string, unknown>;
    expect(payload).toEqual({
      location: 'Nueva ubicacion',
      alias: 'Nuevo alias',
      observations: 'Nuevo detalle',
      status: 'maintenance',
      useStartAt: '2026-03-28T09:00',
      useEndAt: '2026-03-28T11:00',
    });
    expect(payload['name']).toBeUndefined();
    expect(payload['clientId']).toBeUndefined();
  });

  it('bloquea el envio si fin de uso es anterior al inicio', () => {
    component.form = {
      ...component.form,
      useStartAt: '2026-03-28T11:00',
      useEndAt: '2026-03-28T10:00',
    };

    component.submit();

    expect(equipmentsService.update).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('La fecha de fin de uso no puede ser menor que la fecha de inicio de uso.');
  });
});
