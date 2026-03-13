import { Injectable } from '@angular/core';
import { AuthApi } from './auth-api';
import { BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class Auth {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private authApi: AuthApi) {}

  loadUser() {
    return this.authApi.Me().pipe(
      tap(user => this.userSubject.next(user))
    );
  }

  login(credentials:any) {
    return this.authApi.login(credentials).pipe(
      switchMap(() => this.loadUser())
    );
  }

  handleGoogleLogin(token: string) {
    return this.authApi.googleLogin(token).pipe(
      switchMap(() => this.loadUser())
    );
  }

  // logout() {
  //   return this.authApi.logout().pipe(
  //     tap(() => this.userSubject.next(null))
  //   );
  // }

  getUser() {
    return this.userSubject.value;
  }

  isAuthenticated() {
    return !!this.userSubject.value;
  }
}
