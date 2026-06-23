import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { BookingServiceService } from '../../../../core/services/booking-service.service';

@Component({
  selector: 'app-edit-service',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './edit-service.component.html'
})
export class EditServiceComponent implements OnInit {
  form!: FormGroup;
  serviceId!: number;
  error = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private bookingServiceService: BookingServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.serviceId = Number(this.route.snapshot.paramMap.get('id'));
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      durationMinutes: [60, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      currency: ['USD']
    });
    this.bookingServiceService.getMyServices().subscribe(services => {
      const service = services.find(s => s.id === this.serviceId);
      if (service) this.form.patchValue(service);
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.bookingServiceService.updateService(this.serviceId, this.form.value).subscribe({
      next: () => this.router.navigate(['/provider/services']),
      error: () => { this.error = 'Failed to update service.'; this.loading = false; }
    });
  }
}
