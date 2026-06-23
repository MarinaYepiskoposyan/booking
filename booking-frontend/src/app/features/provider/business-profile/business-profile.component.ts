import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ProviderProfileService } from '../../../core/services/provider-profile.service';

@Component({
  selector: 'app-business-profile',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './business-profile.component.html'
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
