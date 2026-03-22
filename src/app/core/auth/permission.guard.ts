import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AppRole, RoutePermission } from './auth.models';
import { AuthService } from './auth.service';

const hasAccess = (route: ActivatedRouteSnapshot, authService: AuthService): boolean => {
  const requiredRoles = route.data['requiredRoles'] as AppRole[] | undefined;
  if (requiredRoles?.length) {
    return authService.hasRole(requiredRoles);
  }

  const requiredPermission = route.data['requiredPermission'] as RoutePermission | undefined;
  if (requiredPermission) {
    return authService.canAccess(requiredPermission.resource, requiredPermission.action);
  }

  return true;
};

export const permissionGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (hasAccess(route, authService)) {
    return true;
  }

  return router.createUrlTree(['/access-denied']);
};
