import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ClientsService } from '../../../core/services/clients.service';
import { EquipmentsService } from '../../../core/services/equipments.service';
import { SchedulesService } from '../../../core/services/schedules.service';
import { ScheduleCreateComponent } from './schedule-create.component';

describe('ScheduleCreateComponent', () => {
  let fixture: any;
  let component: ScheduleCreateComponent;
  let schedulesService: jasmine.SpyObj<SchedulesService>;
  let router: Router;

  beforeEach(async () => {
    schedulesService = jasmine.createSpyObj<SchedulesService>('SchedulesService', ['create']);

    await TestBed.configureTestingModule({
      imports: [ScheduleCreateComponent],
      providers: [
        provideRouter([]),
        { provide: SchedulesService, useValue: schedulesService },
        { provide: ClientsService, useValue: { getAll: () => of([{ id: 1, name: 'Cliente', address: '', phone: '', email: '', description: '', status: 'active' }]) } },
        {
          provide: EquipmentsService,
          useValue: {
            getAll: () =>
              of([
                { id: 10, name: 'Equipo valido', type: '', location: '', brand: '', model: '', serial: '', fixedAssetCode: '', alias: '', clientId: 1, clientName: 'Cliente', observations: '', status: 'active' },
                { id: 11, name: 'Equipo bloqueado', type: '', location: '', brand: '', model: '', serial: '', fixedAssetCode: '', alias: '', clientId: 1, clientName: 'Cliente', observations: '', status: 'retirado' },
                { id: 12, name: 'Equipo otro cliente', type: '', location: '', brand: '', model: '', serial: '', fixedAssetCode: '', alias: '', clientId: 2, clientName: 'Otro', observations: '', status: 'active' },
              ]),
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
    schedulesService.create.and.returnValue(of({} as any));
    fixture = TestBed.createComponent(ScheduleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('filtra equipos por cliente y excluye estados bloqueados', () => {
    component.form.clientId = 1;

    expect(component.filteredEquipments.map((equipment) => equipment.id)).toEqual([10]);
  });

  it('limpia equipos invalidos al cambiar de cliente', () => {
    component.form.clientId = 1;
    component.form.equipmentIds = [10, 12];

    component.onClientChange();

    expect(component.form.equipmentIds).toEqual([10]);
  });

  it('valida que exista al menos un equipo antes de guardar', () => {
    component.form = {
      clientId: 1,
      name: ' Preventivo marzo ',
      type: 'preventive',
      scheduledDate: '2026-03-28T08:30',
      description: ' ',
      equipmentIds: [],
    };

    component.submit();

    expect(schedulesService.create).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Debe seleccionar al menos un equipo.');
  });

  it('crea el cronograma con datos saneados y navega a la lista', () => {
    component.form = {
      clientId: 1,
      name: ' Preventivo marzo ',
      type: 'preventive',
      scheduledDate: '2026-03-28T08:30',
      description: ' Mantenimiento mensual ',
      equipmentIds: [10],
    };

    component.submit();

    expect(schedulesService.create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        clientId: 1,
        name: 'Preventivo marzo',
        description: 'Mantenimiento mensual',
        equipmentIds: [10],
      })
    );
    expect(router.navigate).toHaveBeenCalledWith(['/schedule/list']);
  });
});
