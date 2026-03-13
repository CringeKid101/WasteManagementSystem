import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthApi } from '../../../core/services/auth-api';
import {RouterLink} from "@angular/router";
import { LoginRequest } from '../../../core/models/login-request.model';

declare const google: any;

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatInputModule,
    MatButtonModule,
    RouterLink
],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit, AfterViewInit {
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authApi: AuthApi,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id: '902810269128-2qtfjap786daklf1etak8g975c2c616c.apps.googleusercontent.com',
      callback: this.handleGoogleLogin.bind(this),
      auto_select: false,
      cancel_on_tap_outside: false,
    });

    google.accounts.id.renderButton(document.getElementById('googleButton'), {
      theme: 'outline',
      size: 'large',
      shape: "pill",
      width: 300,
    });
  }

  handleGoogleLogin(response: any) {
    const token = response.credential;
    console.log('Google ID Token:', token);
    this.authApi.googleLogin(token).subscribe();
  }

  submit() {
    if (this.loginForm.invalid) return;
    const data: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,    
    }
    this.authApi.login(data).subscribe({
      next: (res) => {
        console.log('Login successful:', res);
        console.log(res);
      },
      error: (err) => {
        console.error('Login failed:', err);
      }
    });
  }
}
