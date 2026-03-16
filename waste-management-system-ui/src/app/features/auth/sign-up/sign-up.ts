import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { NonNullableFormBuilder, Validators, ValidationErrors, FormGroup } from '@angular/forms';
import { AuthApi } from '../../../core/services/auth-api';
import { RegisterRequest } from '../../../core/models/register-request.model';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-sign-up',
  imports: [
    ReactiveFormsModule,
    MatError,
    MatLabel,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp implements OnInit {
  signUpForm!: FormGroup;

  constructor(
    private fb: NonNullableFormBuilder,
    private authApi: AuthApi,
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$',
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmControl = control.get('confirmPassword');

    if (!confirmControl) return null;

    const confirmPassword = confirmControl.value;

    if (password !== confirmPassword) {
      confirmControl.setErrors({
        ...confirmControl.errors,
        passwordMismatch: true,
      });
    } else {
      if (confirmControl.errors) {
        const { passwordMismatch, ...otherErrors } = confirmControl.errors;

        confirmControl.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
      }
    }

    return null;
  }

  submit() {
    if (this.signUpForm.invalid) return;

    const data: RegisterRequest = {
      FirstName: this.signUpForm.value.firstName,
      LastName: this.signUpForm.value.lastName,
      Email: this.signUpForm.value.email,
      Password: this.signUpForm.value.password,
      ConfirmPassword: this.signUpForm.value.confirmPassword,
    };

    this.authApi.register(data).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
      },
      error: (error) => {
        console.error('Registration failed', error);
      },
    });
  }
}
