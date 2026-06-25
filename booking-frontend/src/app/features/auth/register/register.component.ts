import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './register.component.html',
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
      padding: 24px;
    }

    .auth-card {
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      padding: 48px 40px;
      width: 100%;
      max-width: 480px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .auth-logo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      background: #4F46E5;
      color: white;
      border-radius: 16px;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .auth-title {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 6px;
    }

    .auth-subtitle {
      font-size: 14px;
      color: #6B7280;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-size: 13px;
      font-weight: 500;
      color: #374151;
    }

    .optional {
      font-size: 12px;
      color: #9CA3AF;
      font-weight: 400;
      margin-left: 4px;
    }

    .form-input {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      font-size: 15px;
      color: #111827;
      background: white;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #4F46E5;
      box-shadow: 0 0 0 3px rgba(79,70,229,0.12);
    }

    .error-text {
      color: #EF4444;
      font-size: 13px;
    }

    .alert-error {
      background: #FEF2F2;
      border: 1px solid #FECACA;
      border-radius: 6px;
      padding: 12px 16px;
      color: #EF4444;
      font-size: 14px;
    }

    .btn-primary {
      width: 100%;
      padding: 12px 20px;
      background: #4F46E5;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
      min-height: 44px;
      margin-top: 4px;
    }

    .btn-primary:hover:not(:disabled) {
      background: #4338CA;
    }

    .btn-primary:active:not(:disabled) {
      transform: translateY(1px);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .auth-switch {
      text-align: center;
      margin-top: 24px;
      font-size: 14px;
      color: #6B7280;
    }

    .auth-switch a {
      color: #4F46E5;
      font-weight: 500;
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: 32px 24px;
      }
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent {
  form: FormGroup;
  error = '';
  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone: [''],
      role: ['CLIENT', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.authService.register(this.form.value).subscribe({
      next: (res) => {
        this.router.navigate([res.user.role === 'PROVIDER' ? '/provider/setup' : '/profile']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
