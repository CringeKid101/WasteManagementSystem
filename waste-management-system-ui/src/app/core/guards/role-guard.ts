import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const user = auth.getUser();
  const requiredRoles = route.data['roles'] as Array<string>;
  if(user && requiredRoles.some(role => user.roles.includes(role))){
    return true;
  }
  else {
    return false;
  }
};
