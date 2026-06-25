import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './edit-profile.component.html',
  styles: [`
    .page-wrapper {
      max-width: 620px;
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

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
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

    .btn-primary:hover {
      background: #4338CA;
    }

    .btn-primary:active {
      transform: translateY(1px);
    }

    @media (max-width: 500px) {
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
export class EditProfileComponent implements OnInit {
  form!: FormGroup;
  success = false;
  error = '';

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['']
    });
    this.userService.getProfile().subscribe(user => this.form.patchValue(user));
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.userService.updateProfile(this.form.value).subscribe({
      next: () => { this.success = true; setTimeout(() => this.router.navigate(['/profile']), 1500); },
      error: () => { this.error = 'Update failed. Please try again.'; }
    });
  }
}
