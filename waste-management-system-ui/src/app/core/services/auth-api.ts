import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { catchError, Observable, throwError } from 'rxjs';
import { LoginResponse } from '../models/login-response.model';
import { RegisterRequest } from '../models/register-request.model';
import { RequestOtpRequest } from '../models/request-otp-request.model';
import { VerifyOtpRequest } from '../models/verify-otp-request.model';
import { ResetPasswordRequest } from '../models/reset-password-request';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private baseUrl = 'https://localhost:7019/api/auth';

  constructor(private http: HttpClient) {}

  googleLogin(token: string) {
    return this.http.post('/google-login', { token });
  }
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl + '/login', data);
  }

  register(data: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl + '/register', data);
  }

  requestOtp(otpRequest: RequestOtpRequest): Observable<void> {
    return this.http.post<void>(this.baseUrl + '/forgot-password', otpRequest.email).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to send OTP'));
      }),
    );
  }

  verifyOtp(verifyRequest: VerifyOtpRequest): Observable<any> {
    return this.http.post('/api/auth/verify-otp', verifyRequest).pipe(
      catchError((error) => {
        return throwError(() => new Error('OTP verification failed'));
      }),
    );
  }

  resetPassword(resetRequest: ResetPasswordRequest): Observable<any> {
    return this.http.post('/api/auth/reset-password', resetRequest).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to reset password'));
      }),
    );
  }
}
