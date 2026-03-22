import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ClientsService } from '../../../core/services/clients.service';
import { EquipmentsService } from '../../../core/services/equipments.service';
import { SchedulesService } from '../../../core/services/schedules.service';
import { ScheduleEditComponent } from './schedule-edit.component';

const toDateTimeLocalValue = (value: string) => {
  const parsedValue = new Date(value);
  const timezoneOffset = parsedValue.getTimezoneOffset() * 60000;
  return new Date(parsedValue.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

describe('ScheduleEditComponent', () => {
  let fixture: any;
  let component: ScheduleEditComponent;
  let schedulesService: jasmine.SpyObj<SchedulesService>;
  let router: Router;

  beforeEach(async () => {
    schedulesService = jasmine.createSpyObj<SchedulesService>('SchedulesService', ['getById', 'update']);
    schedulesService.getById.and.returnValue(
      of({
        id: 8,
        clientId: 1,
        name: 'Preventivo marzo',
        type: 'preventive',
        scheduledDate: '2026-03-28T00:00:00.000Z',
        description: 'Mantenimiento mensual',
        equipmentIds: [10],
      } as any)
    );

    await TestBed.configureTestingModule({
      imports: [ScheduleEditComponent],
      providers: [
        provideRouter([]),
        { provide: SchedulesService, useValue: schedulesService },
        { provide: ClientsService, useValue: { getAll: () => of([{ id: 1, name: 'Cliente', address: '', phone: '', email: '', description: '', status: 'active' }]) } },
        {
          provide: EquipmentsService,
          useValue: {
            getAll: () =>
              of([
                { id: 10, name: 'Equipo 1', type: '', location: '', brand: '', model: '', serial: '', fixedAssetCode: '', alias: '', clientId: 1, clientName: 'Cliente', observations: '', status: 'active' },
                { id: 12, name: 'Equipo 2', type: '', location: '', brand: '', model: '', serial: '', fixedAssetCode: '', alias: '', clientId: 2, clientName: 'Otro', observations: '', status: 'active' },
              ]),
          },
        },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '8' } } } },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
    schedulesService.update.and.returnValue(of({} as any));
    fixture = TestBed.createComponent(ScheduleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('convierte la fecha ISO del backend al formato datetime-local', () => {
    expect(component.form.scheduledDate).toBe(toDateTimeLocalValue('2026-03-28T00:00:00.000Z'));
  });

  it('limpia equipos fuera del cliente seleccionado', () => {
    component.form.clientId = 1;
    component.form.equipmentIds = [10, 12];

    component.onClientChange();

    expect(component.form.equipmentIds).toEqual([10]);
  });

  it('actualiza el cronograma y navega a la lista', () => {
    component.form = {
      clientId: 1,
      name: 'Preventivo abril',
      type: 'preventive',
      scheduledDate: '2026-04-01T09:30',
      description: 'Visita programada',
      equipmentIds: [10],
    };

    component.submit();

    expect(schedulesService.update).toHaveBeenCalledWith(
      8,
      jasmine.objectContaining({
        name: 'Preventivo abril',
        equipmentIds: [10],
      })
    );
    expect(router.navigate).toHaveBeenCalledWith(['/schedule/list']);
  });
});
