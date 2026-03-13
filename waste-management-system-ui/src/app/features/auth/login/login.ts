import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Auth } from '../../../core/services/auth';
import { RouterLink } from "@angular/router";
import { LoginRequest } from '../../../core/models/login-request.model';
import { GoogleAuth } from '../../../core/services/google-auth';

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
    private auth: Auth,
    private googleAuth: GoogleAuth
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    this.googleAuth.initialize(this.handleGoogleLogin.bind(this));
    var button = document.getElementById('googleButton');
    if (button) {
      this.googleAuth.renderButton(button);
    }
  }

  handleGoogleLogin(response: any) {
    const token = response.credential;
    console.log('Google ID Token:', token);
    this.auth.handleGoogleLogin(token).subscribe();
  }

  submit() {
    if (this.loginForm.invalid) return;
    const data: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    }
    this.auth.login(data).subscribe({
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
