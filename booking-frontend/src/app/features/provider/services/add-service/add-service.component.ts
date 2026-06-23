import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { BookingServiceService } from '../../../../core/services/booking-service.service';

@Component({
  selector: 'app-add-service',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './add-service.component.html'
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
