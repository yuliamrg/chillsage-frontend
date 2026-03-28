import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { ClientsService } from '../../../core/services/clients.service';
import { ClientEditComponent } from './client-edit.component';

describe('ClientEditComponent', () => {
  let fixture: any;
  let component: ClientEditComponent;
  let router: Router;
  let authService: jasmine.SpyObj<AuthService>;
  let clientsService: jasmine.SpyObj<ClientsService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['role']);
    clientsService = jasmine.createSpyObj<ClientsService>('ClientsService', ['getById', 'update']);
    authService.role.and.returnValue('planeador' as any);
    clientsService.getById.and.returnValue(
      of({
        id: 4,
        name: 'Cliente base',
        address: 'Calle 1',
        phone: '+57 300 123 4567',
        email: 'cliente@example.com',
        description: 'Cliente principal',
        status: 'active',
      })
    );
    clientsService.update.and.returnValue(of({} as any));

    await TestBed.configureTestingModule({
      imports: [ClientEditComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '4' } } } },
        { provide: AuthService, useValue: authService },
        { provide: ClientsService, useValue: clientsService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
    fixture = TestBed.createComponent(ClientEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('envia solo campos operativos cuando el actor es planeador', () => {
    component.form = {
      ...component.form,
      name: 'No debe enviarse',
      address: 'Calle 9',
      phone: '+57 301 987 6543',
      email: 'otro@example.com',
      description: 'Nuevo detalle',
      status: 'inactive',
    };

    component.submit();

    expect(clientsService.update).toHaveBeenCalledWith(4, {
      address: 'Calle 9',
      phone: '+57 301 987 6543',
      description: 'Nuevo detalle',
      status: 'inactive',
    });
  });

  it('bloquea el envio si el telefono no cumple el formato valido', () => {
    component.form = {
      ...component.form,
      phone: '12-34',
    };

    component.submit();

    expect(clientsService.update).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Debe ingresar un telefono valido con al menos 7 digitos.');
  });

  it('bloquea el envio si el correo no tiene formato valido', () => {
    component.form = {
      ...component.form,
      email: 'correo-invalido',
    };

    component.submit();

    expect(clientsService.update).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Debe ingresar un correo valido.');
  });
});
