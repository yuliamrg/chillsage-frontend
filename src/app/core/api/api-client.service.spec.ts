import { HttpErrorResponse } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiClientService } from './api-client.service';
import { API_BASE_URL } from './api.config';

describe('ApiClientService', () => {
  let service: ApiClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ApiClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('normaliza errores 500 con un mensaje generico sin exponer detalles internos', () => {
    let responseError: HttpErrorResponse | undefined;

    service.get('/users').subscribe({
      error: (error) => {
        responseError = error;
      },
    });

    const request = httpMock.expectOne(`${API_BASE_URL}/users`);
    request.flush(
      {
        message: 'SQLSTATE[08006]: connection failure',
        stack: 'stack trace interno',
      },
      { status: 500, statusText: 'Server Error' }
    );

    expect(responseError?.status).toBe(500);
    expect(responseError?.message).toBe('Ha ocurrido un error inesperado. Intenta nuevamente mas tarde.');
    expect(responseError?.error?.msg).toBe('Ha ocurrido un error inesperado. Intenta nuevamente mas tarde.');
    expect(responseError?.error?.stack).toBe('stack trace interno');
  });

  it('mantiene el mensaje contractual en errores no 500 como 429', () => {
    let responseError: HttpErrorResponse | undefined;

    service.post('/users/login', {
      email: 'ana@example.com',
      password: 'secret',
    }).subscribe({
      error: (error) => {
        responseError = error;
      },
    });

    const request = httpMock.expectOne(`${API_BASE_URL}/users/login`);
    request.flush(
      {
        status: false,
        msg: 'Demasiados intentos de inicio de sesion. Intenta nuevamente mas tarde',
        user: null,
      },
      { status: 429, statusText: 'Too Many Requests' }
    );

    expect(responseError?.status).toBe(429);
    expect(responseError?.message).toBe('Demasiados intentos de inicio de sesion. Intenta nuevamente mas tarde');
    expect(responseError?.error?.msg).toBe('Demasiados intentos de inicio de sesion. Intenta nuevamente mas tarde');
  });
});
