import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { catchError, Observable, throwError } from 'rxjs';
import { LoginResponse } from '../models/login-response.model';
import { RegisterRequest } from '../models/register-request.model';
import { VerifyOtpRequest } from '../models/verify-otp-request.model';
import { ResetPasswordRequest } from '../models/reset-password-request.model';
import { ForgotPasswordRequest } from '../models/forgot-password-request.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private baseUrl = 'https://localhost:7019/api/auth';

  constructor(private http: HttpClient) {}

  googleLogin(token: string) {
    return this.http.post('/google-login', { token });
  }

  login(data: LoginRequest): Observable<void> {
    return this.http.post<void>(this.baseUrl + '/login', data, {withCredentials: true});
  }

  Me(): Observable<LoginResponse> {
    return this.http.get<LoginResponse>(this.baseUrl + '/me', {withCredentials: true});
  }

  register(data: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl + '/register', data, {withCredentials: true});
  }

  requestOtp(otpRequest: ForgotPasswordRequest): Observable<void> {
    return this.http.post<void>(this.baseUrl + '/forgot-password', otpRequest.email, {withCredentials: true}).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to send OTP'));
      }),
    );
  }

  verifyOtp(verifyRequest: VerifyOtpRequest): Observable<any> {
    return this.http.post('/api/auth/verify-otp', verifyRequest, {withCredentials: true}).pipe(
      catchError((error) => {
        return throwError(() => new Error('OTP verification failed'));
      }),
    );
  }

  resetPassword(resetRequest: ResetPasswordRequest): Observable<any> {
    return this.http.post('/api/auth/reset-password', resetRequest, {withCredentials: true}).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to reset password'));
      }),
    );
  }
}
