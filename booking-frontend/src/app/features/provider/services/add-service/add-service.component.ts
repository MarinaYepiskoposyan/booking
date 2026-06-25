import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { BookingServiceService } from '../../../../core/services/booking-service.service';

@Component({
  selector: 'app-add-service',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './add-service.component.html',
  styles: [`
    .page-wrapper {
      max-width: 680px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 28px;
    }

    .page-header h1 {
      font-size: 26px;
      font-weight: 700;
      color: #111827;
    }

    .page-header p {
      font-size: 15px;
      color: #6B7280;
      margin-top: 4px;
    }

    .card {
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      padding: 32px;
    }

    .service-form {
      display: flex;
      flex-direction: column;
      gap: 22px;
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

    .required {
      color: #EF4444;
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

    textarea.form-input {
      resize: vertical;
    }

    /* Duration with suffix */
    .input-suffix-wrap {
      display: flex;
      align-items: stretch;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .input-suffix-wrap:focus-within {
      border-color: #4F46E5;
      box-shadow: 0 0 0 3px rgba(79,70,229,0.12);
    }

    .form-input.suffixed {
      border: none;
      border-radius: 0;
      box-shadow: none;
      flex: 1;
    }

    .form-input.suffixed:focus {
      outline: none;
      box-shadow: none;
      border: none;
    }

    .input-suffix {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      background: #F9FAFB;
      border-left: 1px solid #E5E7EB;
      font-size: 13px;
      color: #6B7280;
      white-space: nowrap;
    }

    /* Price + currency */
    .price-row {
      display: flex;
      gap: 0;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .price-row:focus-within {
      border-color: #4F46E5;
      box-shadow: 0 0 0 3px rgba(79,70,229,0.12);
    }

    .currency-select {
      width: auto;
      flex-shrink: 0;
      padding: 10px 10px;
      border: none;
      border-right: 1px solid #E5E7EB;
      border-radius: 0;
      background: #F9FAFB;
      font-size: 13px;
      color: #6B7280;
      box-shadow: none;
    }

    .currency-select:focus {
      outline: none;
      box-shadow: none;
    }

    .price-input {
      flex: 1;
      border: none;
      border-radius: 0;
      box-shadow: none;
    }

    .price-input:focus {
      outline: none;
      box-shadow: none;
      border: none;
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

    .form-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 12px;
      padding-top: 8px;
    }

    .btn-cancel {
      padding: 10px 20px;
      background: none;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      color: #6B7280;
      font-size: 15px;
      font-weight: 500;
      text-decoration: none;
      transition: border-color 0.2s, color 0.2s;
      min-height: 44px;
      display: flex;
      align-items: center;
    }

    .btn-cancel:hover {
      border-color: #9CA3AF;
      color: #111827;
      text-decoration: none;
    }

    .btn-primary {
      padding: 10px 24px;
      background: #4F46E5;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
      min-height: 44px;
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
      gap: 8px;
    }

    .spinner {
      display: inline-block;
      width: 15px;
      height: 15px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 560px) {
      .card {
        padding: 24px;
      }
      .form-row {
        grid-template-columns: 1fr;
      }
      .form-actions {
        flex-direction: column-reverse;
      }
      .btn-cancel, .btn-primary {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class AddServiceComponent {
  form: FormGroup;
  error = '';
  loading = false;

  constructor(private fb: FormBuilder, private bookingServiceService: BookingServiceService, private router: Router) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      durationMinutes: [60, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      currency: ['USD']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.bookingServiceService.addService(this.form.value).subscribe({
      next: () => this.router.navigate(['/provider/services']),
      error: () => { this.error = 'Failed to add service.'; this.loading = false; }
    });
  }
}
