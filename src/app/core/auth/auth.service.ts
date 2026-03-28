import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { ClientVm, UserVm } from '../models/domain.models';
import { mapUser } from '../mappers/domain.mappers';
import { mapLoginResponseToSession } from './auth.mappers';
import {
  AppAction,
  AppRole,
  AppResource,
  AuthSession,
  AuthUser,
  ClientCoverage,
  ClientScopeOption,
  LoginPayload,
  LoginResponse,
} from './auth.models';
import { hasPermission, resolveRole } from './auth.permissions';

const STORAGE_KEY = 'chillsage.auth.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiClientService);
  private readonly router = inject(Router);
  private readonly sessionState = signal<AuthSession | null>(this.readStoredSession());

  readonly session = computed(() => this.sessionState());
  readonly user = computed<AuthUser | null>(() => this.sessionState()?.user ?? null);
  readonly accessToken = computed(() => this.sessionState()?.accessToken ?? null);
  readonly isAuthenticated = computed(() => !!this.sessionState()?.accessToken);
  readonly role = computed(() => {
    const user = this.user();
    return resolveRole(user?.roleId ?? null, user?.roleName ?? null);
  });

  login(payload: LoginPayload) {
    return this.api.post<LoginResponse>('/users/login', payload).pipe(
      tap((response) => {
        const session = mapLoginResponseToSession(response);
        this.persistSession(session);
      })
    );
  }

  logout(redirectUrl = '/login'): void {
    this.clearSession();
    this.router.navigateByUrl(redirectUrl);
  }

  handleUnauthorized(): void {
    this.clearSession();
    this.router.navigate(['/login'], {
      queryParams: { reason: 'expired' },
    });
  }

  hasRole(roles: AppRole[]): boolean {
    const currentRole = this.role();
    return !!currentRole && roles.includes(currentRole);
  }

  isPlatformAdmin(): boolean {
    return this.role() === 'admin_plataforma';
  }

  hasGlobalClientCoverage(): boolean {
    const user = this.user();
    return this.isPlatformAdmin() || Boolean(user?.allClients);
  }

  getClientCoverage(): ClientCoverage {
    const user = this.user();
    return {
      primaryClientId: user?.primaryClientId ?? null,
      clientIds: user?.clientIds ?? [],
      allClients: this.hasGlobalClientCoverage(),
    };
  }

  canAccessClient(clientId: number | null | undefined): boolean {
    if (!clientId) {
      return false;
    }

    if (this.hasGlobalClientCoverage()) {
      return true;
    }

    return this.getClientCoverage().clientIds.includes(clientId);
  }

  getScopedClients(clients: ClientVm[]): ClientVm[] {
    if (this.hasGlobalClientCoverage()) {
      return clients;
    }

    return clients.filter((client) => this.canAccessClient(client.id));
  }

  buildClientScopeOptions(clients: ClientVm[]): ClientScopeOption {
    const scopedClients = this.getScopedClients(clients);
    return {
      clients: scopedClients,
      showSelector: this.hasGlobalClientCoverage() || scopedClients.length > 1,
    };
  }

  getPreferredClientId(): number | null {
    return this.user()?.primaryClientId ?? null;
  }

  canAccess(resource: AppResource, action: AppAction): boolean {
    return hasPermission(this.role(), resource, action);
  }

  private persistSession(session: AuthSession): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    this.sessionState.set(session);
  }

  private clearSession(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.sessionState.set(null);
  }

  private readStoredSession(): AuthSession | null {
    try {
      const rawValue = localStorage.getItem(STORAGE_KEY);
      if (!rawValue) {
        return null;
      }

      const parsedValue = JSON.parse(rawValue) as Partial<AuthSession> & { user?: UserVm | unknown };
      if (!parsedValue.accessToken || !parsedValue.user) {
        return null;
      }

      return {
        accessToken: parsedValue.accessToken,
        tokenType: parsedValue.tokenType ?? 'Bearer',
        expiresIn: parsedValue.expiresIn ?? '',
        user: mapUser(parsedValue.user),
      };
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
}
