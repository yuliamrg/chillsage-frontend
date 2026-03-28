import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: any;
  let component: LoginComponent;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({}),
            },
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.resolveTo(true);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('envia login con email y password', () => {
    authService.login.and.returnValue(of({} as any));
    component.form.setValue({
      email: 'ana@example.com',
      password: 'secret',
    });

    component.submit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'ana@example.com',
      password: 'secret',
    });
  });

  it('muestra un mensaje estable ante 429 por rate limiting', () => {
    authService.login.and.returnValue(
      throwError(() => ({
        status: 429,
        error: {
          msg: 'texto variable backend',
        },
      }))
    );
    component.form.setValue({
      email: 'ana@example.com',
      password: 'secret',
    });

    component.submit();

    expect(component.errorMessage).toBe('Demasiados intentos de inicio de sesion. Intenta nuevamente mas tarde.');
    expect(component.isSubmitting).toBeFalse();
  });

  it('usa el mensaje normalizado para errores 500 sin depender de detalles internos', () => {
    authService.login.and.returnValue(
      throwError(() => ({
        status: 500,
        error: {
          msg: 'Ha ocurrido un error inesperado. Intenta nuevamente mas tarde.',
        },
        message: 'stack interna',
      }))
    );
    component.form.setValue({
      email: 'ana@example.com',
      password: 'secret',
    });

    component.submit();

    expect(component.errorMessage).toBe('Ha ocurrido un error inesperado. Intenta nuevamente mas tarde.');
    expect(component.isSubmitting).toBeFalse();
  });
});
