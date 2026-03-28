import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { permissionGuard } from './permission.guard';

describe('permissionGuard', () => {
  let router: Router;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['hasRole', 'canAccess']);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
    });

    router = TestBed.inject(Router);
  });

  it('permite el acceso cuando la ruta no declara restricciones', () => {
    const result = TestBed.runInInjectionContext(() =>
      permissionGuard({ data: {} } as any, {} as any)
    );

    expect(result).toBeTrue();
    expect(authService.hasRole).not.toHaveBeenCalled();
    expect(authService.canAccess).not.toHaveBeenCalled();
  });

  it('permite el acceso cuando el rol requerido coincide', () => {
    authService.hasRole.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      permissionGuard({ data: { requiredRoles: ['admin_plataforma'] } } as any, {} as any)
    );

    expect(result).toBeTrue();
    expect(authService.hasRole).toHaveBeenCalledWith(['admin_plataforma']);
  });

  it('redirige a access-denied cuando el rol no coincide', () => {
    authService.hasRole.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      permissionGuard({ data: { requiredRoles: ['planeador'] } } as any, {} as any)
    );

    expect(router.serializeUrl(result as any)).toBe('/access-denied');
  });

  it('permite el acceso cuando el permiso requerido existe', () => {
    authService.canAccess.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      permissionGuard({
        data: {
          requiredPermission: { resource: 'requests', action: 'create' },
        },
      } as any, {} as any)
    );

    expect(result).toBeTrue();
    expect(authService.canAccess).toHaveBeenCalledWith('requests', 'create');
  });

  it('redirige a access-denied cuando falta el permiso requerido', () => {
    authService.canAccess.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      permissionGuard({
        data: {
          requiredPermission: { resource: 'users', action: 'delete' },
        },
      } as any, {} as any)
    );

    expect(router.serializeUrl(result as any)).toBe('/access-denied');
  });
});
