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

    // console.log('Send OTP to', email);
    this.authApi.requestOtp(email).subscribe(
      
    );

    this.step = 2;
  }

  verifyOtp() {
    if (this.otpForm.invalid) return;

    console.log('OTP', this.otpForm.value.otp);

    this.step = 3;
  }

  resetPassword() {
    if (this.passwordForm.invalid) return;

    console.log('Reset password');

    this.step = 4;
  }
}

