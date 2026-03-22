import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { SchedulesService } from '../../../core/services/schedules.service';
import { ScheduleDetailComponent } from './schedule-detail.component';

describe('ScheduleDetailComponent', () => {
  let fixture: any;
  let component: ScheduleDetailComponent;
  let schedulesService: jasmine.SpyObj<SchedulesService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    schedulesService = jasmine.createSpyObj<SchedulesService>('SchedulesService', ['getById', 'open', 'close']);
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['canAccess']);
    schedulesService.getById.and.returnValue(
      of({
        id: 8,
        status: 'unassigned',
      } as any)
    );
    authService.canAccess.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [ScheduleDetailComponent],
      providers: [
        provideRouter([]),
        { provide: SchedulesService, useValue: schedulesService },
        { provide: AuthService, useValue: authService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '8' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('carga el cronograma y habilita abrir segun estado', () => {
    expect(schedulesService.getById).toHaveBeenCalledWith(8);
    expect(component.canOpen()).toBeTrue();
    expect(component.canClose()).toBeFalse();
  });

  it('abre el cronograma con body vacio', () => {
    schedulesService.open.and.returnValue(of({ id: 8, status: 'open' } as any));

    component.openSchedule();

    expect(schedulesService.open).toHaveBeenCalledWith(8, {});
    expect(component.schedule?.status).toBe('open');
  });
});
