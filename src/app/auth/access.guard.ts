import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const canActivateAuth = () => {
  const isLoggerIn = inject(AuthService).isAuth;

  if (isLoggerIn) {
    return true;
  }

  return inject(Router).createUrlTree(['/login']);
}
