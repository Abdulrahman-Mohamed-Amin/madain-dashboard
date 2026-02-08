import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/AUth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  let auth = inject(AuthService)
  let router = inject(Router)

  if(auth.isLogged()) return true

  router.navigateByUrl('/login')
  return false;
};
