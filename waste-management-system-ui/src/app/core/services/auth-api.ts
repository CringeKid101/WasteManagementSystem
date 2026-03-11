import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/login-response.model';
import { RegisterRequest } from '../models/register-request.model';

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

  requestOtp(email: string): Observable<void> {
    return this.http.post<void>(this.baseUrl + '/forgot-password', { email });
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post('/api/auth/verify-otp', { email, otp });
  }

  // resetPassword(resetData: ResetPasswordDto): Observable<any> {
  //   return this.http.post('/api/auth/reset-password', resetData);
  // }
}
