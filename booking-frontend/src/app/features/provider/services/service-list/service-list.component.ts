import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { BookingServiceService } from '../../../../core/services/booking-service.service';
import { BookingService } from '../../../../core/models/service.model';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, CurrencyPipe],
  templateUrl: './service-list.component.html'
})
export class ServiceListComponent implements OnInit {
  services: BookingService[] = [];
  loading = true;

  constructor(private bookingServiceService: BookingServiceService) {}

  ngOnInit(): void {
    this.bookingServiceService.getMyServices().subscribe({
      next: (services) => { this.services = services; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
