import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { BookingServiceService } from '../../../../core/services/booking-service.service';
import { BookingService } from '../../../../core/models/service.model';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, CurrencyPipe],
  templateUrl: './service-list.component.html',
  styles: [`
    .page-wrapper {
      max-width: 1100px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 32px;
      gap: 16px;
    }

    .header-text h1 {
      font-size: 26px;
      font-weight: 700;
      color: #111827;
    }

    .header-text p {
      font-size: 15px;
      color: #6B7280;
      margin-top: 4px;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 20px;
      background: #4F46E5;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      transition: background 0.2s;
      cursor: pointer;
      min-height: 44px;
      flex-shrink: 0;
    }

    .btn-primary:hover {
      background: #4338CA;
      text-decoration: none;
      color: white;
    }

    .btn-icon {
      font-size: 18px;
      line-height: 1;
    }

    /* Skeleton loading */
    .service-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .skeleton-card {
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      animation: pulse 1.5s ease-in-out infinite;
    }

    .skel {
      background: #E5E7EB;
      border-radius: 4px;
    }

    .skel-title  { height: 18px; width: 65%; }
    .skel-text   { height: 13px; width: 90%; }
    .skel-badges { height: 26px; width: 55%; }
    .skel-btn    { height: 36px; width: 100%; border-radius: 6px; margin-top: 8px; }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.5; }
    }

    /* Empty state */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 64px 24px;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      gap: 12px;
    }

    .empty-icon {
      font-size: 40px;
      color: #9CA3AF;
      margin-bottom: 8px;
    }

    .empty-state h2 {
      font-size: 20px;
      font-weight: 600;
      color: #111827;
    }

    .empty-state p {
      font-size: 15px;
      color: #6B7280;
      max-width: 320px;
      margin-bottom: 8px;
    }

    /* Service cards */
    .service-card {
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: box-shadow 0.2s, transform 0.2s;
    }

    .service-card:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.10);
      transform: translateY(-2px);
    }

    .card-top {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .status-dot.active   { background: #10B981; }
    .status-dot.inactive { background: #9CA3AF; }

    .status-label {
      font-size: 12px;
      font-weight: 500;
      color: #6B7280;
    }

    .service-name {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      line-height: 1.3;
    }

    .service-desc {
      font-size: 14px;
      color: #6B7280;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .service-desc.muted {
      color: #9CA3AF;
      font-style: italic;
    }

    .badges {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 4px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 500;
    }

    .badge-duration {
      background: #EEF2FF;
      color: #4F46E5;
    }

    .badge-price {
      background: #ECFDF5;
      color: #10B981;
    }

    .btn-edit {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 9px 16px;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      color: #4F46E5;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      transition: background 0.2s, border-color 0.2s;
      min-height: 44px;
      margin-top: 6px;
    }

    .btn-edit:hover {
      background: #EEF2FF;
      border-color: #4F46E5;
      text-decoration: none;
      color: #4F46E5;
    }

    @media (max-width: 600px) {
      .page-header {
        flex-direction: column;
      }
      .btn-primary {
        width: 100%;
        justify-content: center;
      }
    }
  `]
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
