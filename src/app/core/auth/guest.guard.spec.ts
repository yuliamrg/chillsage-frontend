import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { guestGuard } from './guest.guard';

describe('guestGuard', () => {
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

  it('permite entrar a login cuando no hay sesion', () => {
    authService.isAuthenticated.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));

    expect(result).toBeTrue();
  });

  it('redirige a dashboard cuando ya existe sesion', () => {
    authService.isAuthenticated.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));

    expect(router.serializeUrl(result as any)).toBe('/dashboard');
  });
});
