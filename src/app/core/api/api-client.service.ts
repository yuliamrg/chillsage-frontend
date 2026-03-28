import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly unexpectedServerErrorMessage = 'Ha ocurrido un error inesperado. Intenta nuevamente mas tarde.';

  private buildOptions(params?: Record<string, string | number | boolean | null | undefined>) {
    if (!params) {
      return {};
    }

    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        return;
      }

      httpParams = httpParams.set(key, String(value));
    });

    return { params: httpParams };
  }

  private normalizeError(error: unknown) {
    const httpError = error as HttpErrorResponse;
    const payload = httpError?.error;
    const isServerError = (httpError?.status ?? 0) >= 500;
    const message =
      isServerError
        ? this.unexpectedServerErrorMessage
        : payload?.msg ??
          payload?.message ??
          payload?.error ??
      httpError?.message ??
      'Ha ocurrido un error al procesar la solicitud.';

    return throwError(() => ({
      ...httpError,
      error: {
        ...(typeof payload === 'object' && payload !== null ? payload : {}),
        msg: message,
      },
      message,
    }));
  }

  get<T>(path: string, params?: Record<string, string | number | boolean | null | undefined>): Observable<T> {
    return this.http
      .get<T>(`${API_BASE_URL}${path}`, this.buildOptions(params))
      .pipe(catchError((error) => this.normalizeError(error)));
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${API_BASE_URL}${path}`, body).pipe(catchError((error) => this.normalizeError(error)));
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${API_BASE_URL}${path}`, body).pipe(catchError((error) => this.normalizeError(error)));
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${API_BASE_URL}${path}`).pipe(catchError((error) => this.normalizeError(error)));
  }
}
