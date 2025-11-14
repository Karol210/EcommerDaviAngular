import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppRoutes } from '../enums/app-routes.enum';

/**
 * Protege rutas de administración verificando autenticación.
 */
export const adminAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdminAuthenticated()) {
    return true;
  }

  router.navigate([AppRoutes.ADMIN_LOGIN]);
  return false;
};

