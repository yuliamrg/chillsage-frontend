import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_BASE_URL } from '../api/api.config';
import { AuthService } from './auth.service';

const isApiRequest = (url: string): boolean => url.startsWith(API_BASE_URL);
const isLoginRequest = (url: string): boolean => url === `${API_BASE_URL}/users/login`;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.accessToken();

  const request =
    token && isApiRequest(req.url) && !isLoginRequest(req.url)
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      : req;

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
