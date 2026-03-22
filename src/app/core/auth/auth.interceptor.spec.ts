import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { API_BASE_URL } from '../api/api.config';
import { AuthService } from './auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let router: Router;
  let authService: {
    accessToken: jasmine.Spy;
    handleUnauthorized: jasmine.Spy;
  };

  beforeEach(() => {
    authService = {
      accessToken: jasmine.createSpy('accessToken'),
      handleUnauthorized: jasmine.createSpy('handleUnauthorized'),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authService },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('agrega el bearer token en requests API protegidos', () => {
    authService.accessToken.and.returnValue('jwt-token');

    httpClient.get(`${API_BASE_URL}/users`).subscribe();

    const request = httpMock.expectOne(`${API_BASE_URL}/users`);
    expect(request.request.headers.get('Authorization')).toBe('Bearer jwt-token');

    request.flush({ data: [] });
  });

  it('no agrega authorization en /users/login', () => {
    authService.accessToken.and.returnValue('jwt-token');

    httpClient.post(`${API_BASE_URL}/users/login`, {
      email: 'admin@example.com',
      password: 'secret',
    }).subscribe();

    const request = httpMock.expectOne(`${API_BASE_URL}/users/login`);
    expect(request.request.headers.has('Authorization')).toBeFalse();

    request.flush({ status: true });
  });

  it('no agrega authorization si no existe token', () => {
    authService.accessToken.and.returnValue(null);

    httpClient.get(`${API_BASE_URL}/requests`).subscribe();

    const request = httpMock.expectOne(`${API_BASE_URL}/requests`);
    expect(request.request.headers.has('Authorization')).toBeFalse();

    request.flush({ data: [] });
  });

  it('ejecuta handleUnauthorized ante 401 fuera de login', () => {
    authService.accessToken.and.returnValue('jwt-token');
    let responseError: HttpErrorResponse | undefined;

    httpClient.get(`${API_BASE_URL}/orders`).subscribe({
      error: (error) => {
        responseError = error;
      },
    });

    const request = httpMock.expectOne(`${API_BASE_URL}/orders`);
    request.flush({ msg: 'Token expirado' }, { status: 401, statusText: 'Unauthorized' });

    expect(authService.handleUnauthorized).toHaveBeenCalled();
    expect(responseError?.status).toBe(401);
  });

  it('no ejecuta handleUnauthorized ante 401 en login', () => {
    authService.accessToken.and.returnValue('jwt-token');

    httpClient.post(`${API_BASE_URL}/users/login`, {
      email: 'admin@example.com',
      password: 'bad-pass',
    }).subscribe({
      error: () => undefined,
    });

    const request = httpMock.expectOne(`${API_BASE_URL}/users/login`);
    request.flush({ msg: 'Credenciales invalidas' }, { status: 401, statusText: 'Unauthorized' });

    expect(authService.handleUnauthorized).not.toHaveBeenCalled();
  });

  it('redirige a access-denied ante 403 fuera de login', () => {
    authService.accessToken.and.returnValue('jwt-token');
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    httpClient.get(`${API_BASE_URL}/roles`).subscribe({
      error: () => undefined,
    });

    const request = httpMock.expectOne(`${API_BASE_URL}/roles`);
    request.flush({ msg: 'Sin permisos' }, { status: 403, statusText: 'Forbidden' });

    expect(navigateByUrlSpy).toHaveBeenCalledWith('/access-denied');
  });

  it('no redirige a access-denied ante 403 en login', () => {
    authService.accessToken.and.returnValue('jwt-token');
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    httpClient.post(`${API_BASE_URL}/users/login`, {
      email: 'admin@example.com',
      password: 'bad-pass',
    }).subscribe({
      error: () => undefined,
    });

    const request = httpMock.expectOne(`${API_BASE_URL}/users/login`);
    request.flush({ msg: 'Bloqueado' }, { status: 403, statusText: 'Forbidden' });

    expect(navigateByUrlSpy).not.toHaveBeenCalled();
  });
});
