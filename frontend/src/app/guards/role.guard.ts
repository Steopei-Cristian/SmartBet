import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (route: any) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'];

  const user = authService.getCurrentUser();
  if (user?.role === requiredRole) {
    return true;
  }

  router.navigate(['/home']);
  return false;
};