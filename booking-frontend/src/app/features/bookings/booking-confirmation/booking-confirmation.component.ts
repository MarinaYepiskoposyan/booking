import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="card">
        <div class="checkmark-circle">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 20L17 27L30 14" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <h1 class="title">Booking Confirmed!</h1>
        <p class="subtitle">Your appointment has been successfully scheduled.</p>

        <div class="details-card">
          <div class="detail-row" *ngIf="providerName">
            <span class="detail-label">Provider</span>
            <span class="detail-value">{{ providerName }}</span>
          </div>
          <div class="detail-row" *ngIf="serviceName">
            <span class="detail-label">Service</span>
            <span class="detail-value">{{ serviceName }}</span>
          </div>
          <div class="detail-row" *ngIf="slotDate">
            <span class="detail-label">Date</span>
            <span class="detail-value">{{ slotDate | date:'MMMM d, y' }}</span>
          </div>
          <div class="detail-row" *ngIf="startTime">
            <span class="detail-label">Time</span>
            <span class="detail-value">{{ startTime }}</span>
          </div>
        </div>

        <div class="status-badge">
          <span class="dot"></span>
          Pending confirmation from provider
        </div>

        <div class="actions">
          <button routerLink="/bookings/my" class="btn-primary">
            View My Bookings
          </button>
          <button routerLink="/providers" class="btn-secondary">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh;
      background: #F9FAFB;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      padding-top: 84px;
    }

    .card {
      background: white;
      border-radius: 16px;
      border: 1px solid #E5E7EB;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      padding: 48px 40px;
      max-width: 480px;
      width: 100%;
      text-align: center;
    }

    .checkmark-circle {
      width: 80px;
      height: 80px;
      background: #4F46E5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      box-shadow: 0 8px 24px rgba(79,70,229,0.3);
    }

    .title {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 8px;
    }

    .subtitle {
      font-size: 15px;
      color: #6B7280;
      margin: 0 0 28px;
    }

    .details-card {
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 10px;
      padding: 20px 24px;
      margin-bottom: 20px;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .detail-label {
      font-size: 13px;
      font-weight: 600;
      color: #9CA3AF;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      flex-shrink: 0;
    }

    .detail-value {
      font-size: 14px;
      font-weight: 500;
      color: #111827;
      text-align: right;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      color: #92400E;
      border-radius: 100px;
      padding: 6px 16px;
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 28px;
    }

    .dot {
      width: 8px;
      height: 8px;
      background: #F59E0B;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .btn-primary {
      width: 100%;
      padding: 12px 20px;
      background: #4F46E5;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      min-height: 44px;
    }

    .btn-primary:hover {
      background: #4338CA;
    }

    .btn-secondary {
      width: 100%;
      padding: 12px 20px;
      background: white;
      color: #374151;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
      min-height: 44px;
    }

    .btn-secondary:hover {
      background: #F9FAFB;
      border-color: #D1D5DB;
    }

    @media (max-width: 520px) {
      .card {
        padding: 32px 20px;
      }
    }
  `]
})
export class BookingConfirmationComponent implements OnInit {
  providerName = '';
  serviceName = '';
  slotDate = '';
  startTime = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    this.providerName = params.get('providerName') ?? '';
    this.serviceName  = params.get('serviceName') ?? '';
    this.slotDate     = params.get('slotDate') ?? '';
    this.startTime    = params.get('startTime') ?? '';
  }
}
