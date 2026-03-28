import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { API_BASE_URL } from '../api/api.config';
import { AuthService } from './auth.service';
import { LoginResponse } from './auth.models';

const STORAGE_KEY = 'chillsage.auth.session';

const loginResponse: LoginResponse = {
  status: true,
  msg: 'Login exitoso',
  access_token: 'token-123',
  token_type: 'Bearer',
  expires_in: '3600',
  user: {
    id: 7,
    username: 'planner',
    name: 'Ana',
    last_name: 'Lopez',
    email: 'ana@example.com',
    primary_client_id: 3,
    primary_client_name: 'Cliente Demo',
    client_ids: [3, 4],
    all_clients: false,
    clients: [{ id: 3, name: 'Cliente Demo' }, { id: 4, name: 'Cliente Norte' }],
    role: 3,
    role_name: 'planeador',
    status: 'active',
  },
};

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('persiste la sesion y expone el usuario al hacer login', () => {
    let responseBody: LoginResponse | undefined;

    service.login({ email: 'ana@example.com', password: 'secret' }).subscribe((response) => {
      responseBody = response;
    });

    const request = httpMock.expectOne(`${API_BASE_URL}/users/login`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      email: 'ana@example.com',
      password: 'secret',
    });

    request.flush(loginResponse);

    expect(responseBody).toEqual(loginResponse);
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.accessToken()).toBe('token-123');
    expect(service.user()).toEqual({
      id: 7,
      username: 'planner',
      firstName: 'Ana',
      lastName: 'Lopez',
      email: 'ana@example.com',
      primaryClientId: 3,
      primaryClientName: 'Cliente Demo',
      clientIds: [3, 4],
      allClients: false,
      clients: [{ id: 3, name: 'Cliente Demo' }, { id: 4, name: 'Cliente Norte' }],
      clientId: 3,
      clientName: 'Cliente Demo',
      roleId: 3,
      roleName: 'planeador',
      status: 'active',
    });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '')).toEqual({
      accessToken: 'token-123',
      tokenType: 'Bearer',
      expiresIn: '3600',
      user: service.user(),
    });
  });

  it('hidrata la sesion desde localStorage al inicializarse', () => {
    const storedSession = {
      accessToken: 'stored-token',
      tokenType: 'Bearer',
      expiresIn: '1800',
      user: {
        id: 1,
        username: 'admin',
        firstName: 'Ada',
        lastName: 'Admin',
        email: 'admin@example.com',
        primaryClientId: null,
        primaryClientName: null,
        clientIds: [],
        allClients: false,
        clients: [],
        clientId: null,
        clientName: null,
        roleId: 1,
        roleName: 'admin_plataforma',
        status: 'active',
      },
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedSession));

    const hydratedService = TestBed.runInInjectionContext(() => new AuthService());

    expect(hydratedService.isAuthenticated()).toBeTrue();
    expect(hydratedService.accessToken()).toBe('stored-token');
    expect(hydratedService.role()).toBe('admin_plataforma');
    expect(hydratedService.hasRole(['admin_plataforma'])).toBeTrue();
    expect(hydratedService.canAccess('users', 'delete')).toBeTrue();
  });

  it('elimina storage corrupto al intentar hidratar la sesion', () => {
    localStorage.setItem(STORAGE_KEY, '{invalid-json');

    const hydratedService = TestBed.runInInjectionContext(() => new AuthService());

    expect(hydratedService.isAuthenticated()).toBeFalse();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('limpia la sesion y navega al hacer logout', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        accessToken: 'stored-token',
        tokenType: 'Bearer',
        expiresIn: '1800',
        user: {
          id: 3,
          username: 'tech',
          firstName: 'Teo',
          lastName: 'Tecnico',
          email: 'tech@example.com',
          primaryClientId: null,
          primaryClientName: null,
          clientIds: [],
          allClients: false,
          clients: [],
          clientId: null,
          clientName: null,
          roleId: 4,
          roleName: 'tecnico',
          status: 'active',
        },
      })
    );

    const hydratedService = TestBed.runInInjectionContext(() => new AuthService());
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    hydratedService.logout('/login');

    expect(hydratedService.isAuthenticated()).toBeFalse();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/login');
  });

  it('limpia la sesion y redirige con reason=expired ante unauthorized', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        accessToken: 'stored-token',
        tokenType: 'Bearer',
        expiresIn: '1800',
        user: {
          id: 2,
          username: 'requester',
          firstName: 'Sara',
          lastName: 'Solicitante',
          email: 'sara@example.com',
          primaryClientId: 5,
          primaryClientName: 'Cliente X',
          clientIds: [5],
          allClients: false,
          clients: [{ id: 5, name: 'Cliente X' }],
          clientId: 5,
          clientName: 'Cliente X',
          roleId: 2,
          roleName: 'solicitante',
          status: 'active',
        },
      })
    );

    const hydratedService = TestBed.runInInjectionContext(() => new AuthService());
    const navigateSpy = spyOn(router, 'navigate');

    hydratedService.handleUnauthorized();

    expect(hydratedService.isAuthenticated()).toBeFalse();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/login'], {
      queryParams: { reason: 'expired' },
    });
  });

  it('niega permisos cuando no hay rol o el recurso no corresponde', () => {
    expect(service.hasRole(['admin_plataforma'])).toBeFalse();
    expect(service.canAccess('users', 'read')).toBeFalse();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        accessToken: 'token-req',
        tokenType: 'Bearer',
        expiresIn: '900',
        user: {
          id: 9,
          username: 'sol',
          firstName: 'Sol',
          lastName: 'User',
          email: 'sol@example.com',
          primaryClientId: 1,
          primaryClientName: 'Cliente',
          clientIds: [1],
          allClients: false,
          clients: [{ id: 1, name: 'Cliente' }],
          clientId: 1,
          clientName: 'Cliente',
          roleId: 2,
          roleName: 'solicitante',
          status: 'active',
        },
      })
    );

    const hydratedService = TestBed.runInInjectionContext(() => new AuthService());

    expect(hydratedService.hasRole(['solicitante'])).toBeTrue();
    expect(hydratedService.canAccess('requests', 'create')).toBeTrue();
    expect(hydratedService.canAccess('orders', 'update')).toBeFalse();
    expect(hydratedService.canAccess('users', 'read')).toBeFalse();
  });
});
