import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthApi } from '../../../core/services/auth-api';
import { share } from 'rxjs';

declare const google: any;

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatInputModule,
    MatButtonModule,
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
      theme: 'filled_blue',
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
    const data = this.loginForm.value;
    console.log(data);
  }
}
