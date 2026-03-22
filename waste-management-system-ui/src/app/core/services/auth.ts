import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApi } from './auth-api';
import { BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { LoginResponse } from '../models/login-response.model';
@Injectable({
  providedIn: 'root',
})
export class Auth {
  private userSubject = new BehaviorSubject<LoginResponse | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private authApi: AuthApi,
    private router: Router,
  ) {}

  loadUser() {
    return this.authApi.Me().pipe(
      tap((user) => {
        this.userSubject.next(user);
        console.log('User loaded:', user);
      }),
    );
  }

  login(credentials: any) {
    return this.authApi.login(credentials).pipe(
      tap({
        next: (res) => console.log('Login success:', res),
        error: (err) => console.error('Login error:', err),
        complete: () => console.log('Login completed'),
      }),
      switchMap(() => {
        console.log('➡️ Inside switchMap');
        return this.loadUser();
      }),
      tap({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => console.error('Failed to load user after login:', err),
      }),
    );
  }

  handleGoogleLogin(token: string) {
    return this.authApi.googleLogin(token).pipe(switchMap(() => this.loadUser()));
  }

  logout() {
    return this.authApi.logout().pipe(
      tap(() => {
        this.userSubject.next(null);
        this.router.navigate(['/login']);
      }),
    );
  }

  getUser() {
    return this.userSubject.value;
  }

  isAuthenticated() {
    return !!this.userSubject.value;
  }
}
