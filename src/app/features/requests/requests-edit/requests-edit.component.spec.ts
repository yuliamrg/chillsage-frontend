import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ClientsService } from '../../../core/services/clients.service';
import { EquipmentsService } from '../../../core/services/equipments.service';
import { RequestsService } from '../../../core/services/requests.service';
import { UsersService } from '../../../core/services/users.service';
import { RequestsEditComponent } from './requests-edit.component';

describe('RequestsEditComponent', () => {
  let fixture: any;
  let component: RequestsEditComponent;
  let requestsService: jasmine.SpyObj<RequestsService>;
  let router: Router;

  beforeEach(async () => {
    requestsService = jasmine.createSpyObj<RequestsService>('RequestsService', ['getById', 'update']);
    requestsService.getById.and.returnValue(
      of({
        id: 9,
        clientId: 1,
        requesterUserId: 2,
        equipmentId: 3,
        type: 'corrective',
        title: 'Fuga',
        description: 'Revisar presion',
        priority: 'high',
        status: 'pending',
      } as any)
    );

    await TestBed.configureTestingModule({
      imports: [RequestsEditComponent],
      providers: [
        provideRouter([]),
        { provide: RequestsService, useValue: requestsService },
        { provide: ClientsService, useValue: { getAll: () => of([{ id: 1, name: 'Cliente', address: '', phone: '', email: '', description: '', status: 'active' }]) } },
        { provide: UsersService, useValue: { getAll: () => of([{ id: 2, username: 'ana', firstName: 'Ana', lastName: 'Perez', email: '', clientId: 1, clientName: 'Cliente', roleId: 2, roleName: 'solicitante', status: 'active' }]) } },
        { provide: EquipmentsService, useValue: { getAll: () => of([{ id: 3, name: 'Equipo', type: '', location: '', brand: '', model: '', serial: '', fixedAssetCode: '', alias: '', clientId: 1, clientName: 'Cliente', observations: '', status: 'active' }]) } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '9' } } } },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
    requestsService.update.and.returnValue(of({} as any));
    fixture = TestBed.createComponent(RequestsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('actualiza la solicitud cuando sigue pending', () => {
    component.submit();

    expect(requestsService.update).toHaveBeenCalledWith(9, jasmine.objectContaining({ title: 'Fuga' }));
  });

  it('redirige al detalle si la solicitud ya no es editable', async () => {
    requestsService.getById.and.returnValue(
      of({
        id: 9,
        clientId: 1,
        requesterUserId: 2,
        equipmentId: 3,
        type: 'corrective',
        title: 'Fuga',
        description: 'Revisar presion',
        priority: 'high',
        status: 'approved',
      } as any)
    );

    fixture = TestBed.createComponent(RequestsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    await Promise.resolve();

    expect(router.navigate).toHaveBeenCalledWith(['/requests/detail', 9], {
      state: { errorMessage: 'La solicitud ya no se puede editar porque su estado actual es solo lectura.' },
    });
  });
});
