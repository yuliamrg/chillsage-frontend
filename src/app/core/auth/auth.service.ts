import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { mapLoginResponseToSession } from './auth.mappers';
import {
  AppAction,
  AppResource,
  AppRole,
  AuthSession,
  AuthUser,
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
  readonly role = computed<AppRole | null>(() => {
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

      return JSON.parse(rawValue) as AuthSession;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
}
