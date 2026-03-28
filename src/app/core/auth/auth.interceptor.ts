import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_BASE_URL } from '../api/api.config';
import { AuthService } from './auth.service';

const isApiRequest = (url: string): boolean => url.startsWith(API_BASE_URL);
const isLoginRequest = (url: string): boolean => url === `${API_BASE_URL}/users/login`;
const generateRequestId = (): string =>
  globalThis.crypto?.randomUUID?.() ??
  `req-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.accessToken();

  let request = req;

  if (isApiRequest(req.url) && !req.headers.has('X-Request-Id')) {
    request = request.clone({
      setHeaders: {
        'X-Request-Id': generateRequestId(),
      },
    });
  }

  if (token && isApiRequest(req.url) && !isLoginRequest(req.url)) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401 && !isLoginRequest(req.url)) {
          authService.handleUnauthorized();
        }

        if (error.status === 403 && !isLoginRequest(req.url)) {
          router.navigateByUrl('/access-denied');
        }
      }

      return throwError(() => error);
    })
  );
};
