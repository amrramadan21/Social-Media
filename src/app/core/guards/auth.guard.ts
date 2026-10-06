import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Stored_Keys } from '../constants/stored-keys';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem(Stored_Keys.TOKEN);

  if (token) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};
