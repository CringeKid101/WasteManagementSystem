import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, AbstractControl, Validators, ValidationErrors, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Otp } from '../../../core/models/otp';
import { AuthApi } from '../../../core/services/auth-api';
import { ForgotPasswordRequest } from '../../../core/models/forgot-password-request.model';
import { VerifyOtpRequest } from '../../../core/models/verify-otp-request.model';
import { MatLabel } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatError, CommonModule, RouterLink, MatLabel],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword implements OnInit {
  currentStep = 'request';
  step = 1;
  emailForm!: FormGroup;
  passwordForm!: FormGroup;
  errorMessage = signal(''); // Store the error text here
  showError = signal(false);

  constructor(private fb: NonNullableFormBuilder, private authApi: AuthApi) { }

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validators: [this.passwordMatchValidator]

    });
  }

  requestOtp() {
    if (this.emailForm.invalid) return;

    const data: ForgotPasswordRequest = { email: this.emailForm.value.email };
    this.authApi.requestOtp(data).subscribe({
      next: () => {
        console.log('OTP sent successfully');
        this.currentStep = 'verify';
      },
      error: (err) => {
        console.error('Failed to send OTP', err);
      }
    });

    this.currentStep = 'verify';

  }

  verifyOtp(otp: Otp) {
    Object.values(otp).forEach(value => {
      if (value === '' || value.length !== 1) {
        this.errorMessage.set('Please enter a valid 6-digit OTP');
        this.showError.set(true);
        return;
      }
    });
    this.showError.set(false);
    const verifyRequest: VerifyOtpRequest = {
      email: this.emailForm.value.email,
      otp: Object.values(otp).join('')
    };
    this.authApi.verifyOtp(verifyRequest).subscribe({
      next: () => {
        console.log('OTP verified successfully');
        this.currentStep = 'reset';
      },
      error: (err) => {
        console.error('OTP verification failed', err);
      }
    });
    this.currentStep = 'reset';
  }

  resetPassword() {
    if (this.passwordForm.invalid) return;
    const resetRequest = {
      // resetToken: this.otpForm.value.otp,
      newPassword: this.passwordForm.value.password
    };

    // this.authApi.resetPassword(resetRequest).subscribe({
    //   next: () => {
    //     console.log('Password reset successfully');
    //     this.currentStep = 'completed';
    //   },
    //   error: (err) => {
    //     console.error('Failed to reset password', err);
    //   }
    // });
    this.currentStep = 'completed';
  }

  moveNext(event: any, next: HTMLInputElement) {
    if (event.target.value.length === 1) {
      next.focus();
    }
  }
  movePrev(event: KeyboardEvent, prevInput: HTMLInputElement) {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && input.value === '') {
      prevInput.focus();
    }
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
}

