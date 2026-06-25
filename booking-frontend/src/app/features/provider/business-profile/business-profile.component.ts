import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ProviderProfileService } from '../../../core/services/provider-profile.service';

@Component({
  selector: 'app-business-profile',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './business-profile.component.html',
  styles: [`
    .page-wrapper {
      max-width: 720px;
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

    .alert-success {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #ECFDF5;
      border: 1px solid #A7F3D0;
      border-radius: 6px;
      padding: 12px 16px;
      color: #10B981;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 24px;
    }

    .success-icon {
      font-size: 16px;
      font-weight: 700;
    }

    .sections {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .card {
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      padding: 28px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }

    .section-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #4F46E5;
      flex-shrink: 0;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
    }

    .fields {
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

    .required {
      color: #EF4444;
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

    .input-prefix-wrap {
      display: flex;
      align-items: stretch;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .input-prefix-wrap:focus-within {
      border-color: #4F46E5;
      box-shadow: 0 0 0 3px rgba(79,70,229,0.12);
    }

    .input-prefix {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      background: #F9FAFB;
      border-right: 1px solid #E5E7EB;
      font-size: 14px;
      color: #6B7280;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .form-input.prefixed {
      border: none;
      border-radius: 0;
      box-shadow: none;
    }

    .form-input.prefixed:focus {
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
    }

    .btn-primary {
      padding: 12px 28px;
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

    .btn-primary:hover {
      background: #4338CA;
    }

    .btn-primary:active {
      transform: translateY(1px);
    }

    @media (max-width: 560px) {
      .card {
        padding: 20px;
      }
      .form-row {
        grid-template-columns: 1fr;
      }
      .form-actions {
        justify-content: stretch;
      }
      .btn-primary {
        width: 100%;
      }
    }
  `]
})
export class BusinessProfileComponent implements OnInit {
  form!: FormGroup;
  success = false;
  error = '';

  constructor(private fb: FormBuilder, private providerProfileService: ProviderProfileService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      businessName: ['', Validators.required],
      description: [''],
      address: [''],
      city: [''],
      country: [''],
      website: ['']
    });
    this.providerProfileService.getProfile().subscribe({
      next: profile => this.form.patchValue(profile),
      error: () => {} // 404 means new profile — that's fine
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.providerProfileService.createOrUpdateProfile(this.form.value).subscribe({
      next: () => { this.success = true; },
      error: () => { this.error = 'Failed to save profile. Please try again.'; }
    });
  }
}
