import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { RequestsService } from '../../../core/services/requests.service';
import { RequestsDetailComponent } from './requests-detail.component';

describe('RequestsDetailComponent', () => {
  let fixture: any;
  let component: RequestsDetailComponent;
  let requestsService: jasmine.SpyObj<RequestsService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    requestsService = jasmine.createSpyObj<RequestsService>('RequestsService', ['getById', 'approve', 'cancel']);
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['canAccess']);

    requestsService.getById.and.returnValue(
      of({
        id: 9,
        reviewNotes: 'Revision inicial',
        status: 'pending',
      } as any)
    );
    authService.canAccess.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [RequestsDetailComponent],
      providers: [
        provideRouter([]),
        { provide: RequestsService, useValue: requestsService },
        { provide: AuthService, useValue: authService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '9' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('carga la solicitud desde la ruta', () => {
    expect(requestsService.getById).toHaveBeenCalledWith(9);
    expect(component.request?.id).toBe(9);
  });

  it('aprueba solo si tiene permiso', () => {
    requestsService.approve.and.returnValue(of({ id: 9, status: 'approved' } as any));
    spyOn(window, 'prompt').and.returnValue('Aprobada');

    component.approveRequest();

    expect(requestsService.approve).toHaveBeenCalledWith(9, { reviewNotes: 'Aprobada' });
    expect(component.request?.status).toBe('approved');
  });

  it('no anula sin motivo', () => {
    spyOn(window, 'prompt').and.returnValue('');

    component.cancelRequest();

    expect(requestsService.cancel).not.toHaveBeenCalled();
  });
});
