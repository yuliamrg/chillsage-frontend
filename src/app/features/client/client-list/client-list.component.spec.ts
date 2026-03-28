import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { ClientsService } from '../../../core/services/clients.service';
import { ClientListComponent } from './client-list.component';

describe('ClientListComponent', () => {
  let fixture: any;
  let component: ClientListComponent;
  let authService: jasmine.SpyObj<AuthService>;
  let clientsService: jasmine.SpyObj<ClientsService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['canAccess', 'hasRole']);
    clientsService = jasmine.createSpyObj<ClientsService>('ClientsService', ['list', 'remove']);
    authService.canAccess.and.returnValue(true);
    authService.hasRole.and.returnValue(false);
    clientsService.list.and.returnValue(
      of({
        items: [
          {
            id: 1,
            name: 'Cliente 1',
            address: 'Calle 1',
            phone: '+57 300 123 4567',
            email: 'cliente1@example.com',
            description: '',
            status: 'active',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          returned: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        sort: null,
      })
    );
    clientsService.remove.and.returnValue(of({} as any));

    await TestBed.configureTestingModule({
      imports: [ClientListComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        { provide: ClientsService, useValue: clientsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('oculta eliminar cuando el usuario no es admin', () => {
    const deleteButton = fixture.nativeElement.querySelector('button.btn-danger');

    expect(component.canDeleteClients()).toBeFalse();
    expect(deleteButton).toBeNull();
  });

  it('muestra eliminar cuando el usuario es admin', () => {
    authService.hasRole.and.returnValue(true);

    fixture.detectChanges();

    const deleteButton = fixture.nativeElement.querySelector('button.btn-danger');
    expect(component.canDeleteClients()).toBeTrue();
    expect(deleteButton?.textContent).toContain('Eliminar');
  });

  it('trata 409 al eliminar como caso esperado por relaciones existentes', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    authService.hasRole.and.returnValue(true);
    clientsService.remove.and.returnValue(
      throwError(() => new HttpErrorResponse({
        status: 409,
        error: { msg: 'Cliente con relaciones activas' },
      }))
    );

    component.removeClient(1);

    expect(component.errorMessage).toBe('Cliente con relaciones activas');
  });
});
