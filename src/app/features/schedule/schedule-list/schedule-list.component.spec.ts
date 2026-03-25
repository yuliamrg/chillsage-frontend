import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { ClientsService } from '../../../core/services/clients.service';
import { SchedulesService } from '../../../core/services/schedules.service';
import { ScheduleListComponent } from './schedule-list.component';

describe('ScheduleListComponent', () => {
  let fixture: any;
  let component: ScheduleListComponent;
  let schedulesService: jasmine.SpyObj<SchedulesService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    schedulesService = jasmine.createSpyObj<SchedulesService>('SchedulesService', ['getAll', 'open', 'close']);
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['canAccess']);

    await TestBed.configureTestingModule({
      imports: [ScheduleListComponent],
      providers: [
        provideRouter([]),
        { provide: SchedulesService, useValue: schedulesService },
        { provide: AuthService, useValue: authService },
        { provide: ClientsService, useValue: { getAll: () => of([{ id: 1, name: 'Cliente', address: '', phone: '', email: '', description: '', status: 'active' }]) } },
      ],
    }).compileComponents();

    schedulesService.getAll.and.returnValue(of([]));
    authService.canAccess.and.returnValue(true);
    fixture = TestBed.createComponent(ScheduleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('usa los estados operativos nuevos en reglas de accion', () => {
    expect(component.canOpen({ id: 1, status: 'unassigned' } as any)).toBeTrue();
    expect(component.canClose({ id: 1, status: 'open' } as any)).toBeTrue();
    expect(component.canEdit({ id: 1, status: 'closed' } as any)).toBeFalse();
  });

  it('abre el cronograma con body vacio y recarga la lista', () => {
    schedulesService.open.and.returnValue(of({} as any));
    spyOn(component, 'loadSchedules');

    component.openSchedule({ id: 8 } as any);

    expect(schedulesService.open).toHaveBeenCalledWith(8, {});
    expect(component.loadSchedules).toHaveBeenCalled();
  });

  it('traduce los estados del backend a etiquetas de UI', () => {
    expect(component.formatStatus('unassigned')).toBe('Sin asignar');
    expect(component.formatStatus('open')).toBe('Abierto');
    expect(component.formatStatus('closed')).toBe('Cerrado');
  });

  it('no permite cerrar desde unassigned ni abrir desde closed', () => {
    expect(component.canClose({ id: 1, status: 'unassigned' } as any)).toBeFalse();
    expect(component.canOpen({ id: 1, status: 'closed' } as any)).toBeFalse();
  });
});
