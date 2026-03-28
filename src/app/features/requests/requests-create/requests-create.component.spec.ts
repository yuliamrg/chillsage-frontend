import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { ClientsService } from '../../../core/services/clients.service';
import { EquipmentsService } from '../../../core/services/equipments.service';
import { RequestsService } from '../../../core/services/requests.service';
import { UsersService } from '../../../core/services/users.service';
import { RequestsCreateComponent } from './requests-create.component';

describe('RequestsCreateComponent', () => {
  let fixture: any;
  let component: RequestsCreateComponent;
  let requestsService: jasmine.SpyObj<RequestsService>;
  let router: Router;

  beforeEach(async () => {
    requestsService = jasmine.createSpyObj<RequestsService>('RequestsService', ['create']);

    await TestBed.configureTestingModule({
      imports: [RequestsCreateComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            getScopedClients: (clients: any[]) => clients,
            getPreferredClientId: () => null,
            buildClientScopeOptions: (clients: any[]) => ({ clients, showSelector: true }),
          },
        },
        { provide: RequestsService, useValue: requestsService },
        { provide: ClientsService, useValue: { getAll: () => of([{ id: 1, name: 'Cliente', address: '', phone: '', email: '', description: '', status: 'active' }]) } },
        {
          provide: UsersService,
          useValue: {
            getAll: () =>
              of([
                { id: 1, username: 'ana', firstName: 'Ana', lastName: 'Perez', email: '', clientId: 1, clientName: 'Cliente', roleId: 2, roleName: 'solicitante', status: 'active' },
                { id: 2, username: 'luis', firstName: 'Luis', lastName: 'Diaz', email: '', clientId: 1, clientName: 'Cliente', roleId: 2, roleName: 'solicitante', status: 'inactive' },
              ]),
          },
        },
        {
          provide: EquipmentsService,
          useValue: {
            getAll: () =>
              of([
                { id: 10, name: 'Equipo 1', type: '', location: '', brand: '', model: '', serial: '', fixedAssetCode: '', alias: '', clientId: 1, clientName: 'Cliente', observations: '', status: 'active' },
                { id: 11, name: 'Equipo 2', type: '', location: '', brand: '', model: '', serial: '', fixedAssetCode: '', alias: '', clientId: 2, clientName: 'Otro', observations: '', status: 'active' },
              ]),
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
    requestsService.create.and.returnValue(of({} as any));
    fixture = TestBed.createComponent(RequestsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('filtra solicitantes activos y equipos por cliente', () => {
    component.form.clientId = 1;

    expect(component.requesters.length).toBe(1);
    expect(component.filteredEquipments.map((equipment) => equipment.id)).toEqual([10]);
  });

  it('crea la solicitud y redirige a la lista', () => {
    component.form = {
      clientId: 1,
      requesterUserId: 1,
      equipmentId: 10,
      type: 'corrective',
      title: 'Fuga',
      description: 'Revisar presion',
      priority: 'high',
    };

    component.submit();

    expect(requestsService.create).toHaveBeenCalledWith(component.form);
    expect(router.navigate).toHaveBeenCalledWith(['/requests/list']);
  });

  it('muestra el error del backend si falla el guardado', () => {
    requestsService.create.and.returnValue(throwError(() => ({ error: { msg: 'Conflicto' } })));

    component.submit();

    expect(component.errorMessage).toBe('Conflicto');
    expect(component.isSaving).toBeFalse();
  });
});
