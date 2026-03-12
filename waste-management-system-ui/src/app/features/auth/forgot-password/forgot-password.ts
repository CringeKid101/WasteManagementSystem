import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatError, MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLinkActive } from "@angular/router";
import { AuthApi } from '../../../core/services/auth-api';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatError, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword implements OnInit {
  currentStep = 'request';
step = 1;
  emailForm!: FormGroup;
  otpForm!: FormGroup;
  passwordForm!: FormGroup;

  constructor(private fb: FormBuilder, private authApi: AuthApi) {}

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  requestOtp() {
    if (this.emailForm.invalid) return;
    const email = this.emailForm.value.email;
    this.authApi.requestOtp({ email }).subscribe({
      next: () => {
        console.log('OTP sent successfully');
        this.currentStep = 'verify';
      },
      error: (err) => {
        console.error('Failed to send OTP', err);
      }
    }
    );
  }

  verifyOtp() {
    if (this.otpForm.invalid) return;
    const verifyRequest = {
      email: this.emailForm.value.email,
      otp: this.otpForm.value.otp
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
  }

  resetPassword() {
    if (this.passwordForm.invalid) return;
    const resetRequest = {
      resetToken: this.otpForm.value.otp,
      newPassword: this.passwordForm.value.password
    };

    this.authApi.resetPassword(resetRequest).subscribe({
      next: () => {
        console.log('Password reset successfully');
        this.currentStep = 'completed';
      },
      error: (err) => {
        console.error('Failed to reset password', err);
      }
    });
  }
}

