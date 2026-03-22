import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { authChildGuard, authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  let router: Router;
  let authService: { isAuthenticated: jasmine.Spy };

  beforeEach(() => {
    authService = {
      isAuthenticated: jasmine.createSpy('isAuthenticated'),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
    });

    router = TestBed.inject(Router);
  });

  it('permite la navegacion cuando hay sesion', () => {
    authService.isAuthenticated.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/dashboard' } as any)
    );

    expect(result).toBeTrue();
  });

  it('redirige a login con returnUrl cuando no hay sesion', () => {
    authService.isAuthenticated.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/orders/12/edit' } as any)
    );

    expect(router.serializeUrl(result as any)).toBe('/login?returnUrl=%2Forders%2F12%2Fedit');
  });
});

describe('authChildGuard', () => {
  let router: Router;
  let authService: { isAuthenticated: jasmine.Spy };

  beforeEach(() => {
    authService = {
      isAuthenticated: jasmine.createSpy('isAuthenticated'),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
    });

    router = TestBed.inject(Router);
  });

  it('permite el acceso a hijos cuando hay sesion', () => {
    authService.isAuthenticated.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authChildGuard({} as any, { url: '/users' } as any)
    );

    expect(result).toBeTrue();
  });

  it('redirige a login cuando no hay sesion', () => {
    authService.isAuthenticated.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      authChildGuard({} as any, { url: '/requests/new' } as any)
    );

    expect(router.serializeUrl(result as any)).toBe('/login?returnUrl=%2Frequests%2Fnew');
  });
});
