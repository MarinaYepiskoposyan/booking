import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { BookingResponse } from '../../../core/models/booking.model';

@Component({
  selector: 'app-provider-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="container">
        <div class="page-header">
          <h1>Appointments</h1>
          <p>Manage your scheduled client appointments</p>
        </div>

        <!-- Loading skeleton -->
        <ng-container *ngIf="loading">
          <div class="section-label skel-label"></div>
          <div class="booking-card skeleton-card" *ngFor="let s of skeletons">
            <div class="skel skel-title"></div>
            <div class="skel skel-text"></div>
            <div class="skel skel-text-short"></div>
          </div>
        </ng-container>

        <!-- Error state -->
        <div class="error-banner" *ngIf="!loading && error">
          <span>{{ error }}</span>
          <button (click)="loadBookings()" class="btn-retry">Retry</button>
        </div>

        <!-- Empty state -->
        <div class="empty-state" *ngIf="!loading && !error && bookings.length === 0">
          <div class="empty-icon">📅</div>
          <h2>No appointments yet</h2>
          <p>Once clients book your services, their appointments will appear here.</p>
        </div>

        <!-- Upcoming section -->
        <ng-container *ngIf="!loading && !error && upcomingBookings.length > 0">
          <div class="section-label">Upcoming</div>
          <div class="booking-card" *ngFor="let booking of upcomingBookings">
            <div class="card-top">
              <div class="card-info">
                <h3 class="client-name">{{ booking.clientName || 'Client' }}</h3>
                <p class="service-name" *ngIf="booking.serviceName">{{ booking.serviceName }}</p>
                <p class="service-name muted" *ngIf="!booking.serviceName">General appointment</p>
              </div>
              <span class="status-badge" [ngClass]="statusClass(booking.status)">
                {{ booking.status === 'CONFIRMED' ? 'Completed' : booking.status }}
              </span>
            </div>

            <div class="card-meta">
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {{ booking.slotDate | date:'MMMM d, y' }}
              </div>
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {{ booking.startTime }} – {{ booking.endTime }}
              </div>
            </div>

            <p class="notes" *ngIf="booking.notes">{{ booking.notes }}</p>

            <div class="card-actions" *ngIf="booking.status === 'PENDING'">
              <button
                class="btn-complete"
                [disabled]="processingId === booking.id"
                (click)="markComplete(booking.id)">
                {{ processingId === booking.id ? 'Updating...' : 'Mark Complete' }}
              </button>
              <button
                class="btn-cancel"
                [disabled]="processingId === booking.id"
                (click)="cancelBooking(booking.id)">
                {{ processingId === booking.id ? 'Cancelling...' : 'Cancel' }}
              </button>
            </div>
          </div>
        </ng-container>

        <!-- Past section -->
        <ng-container *ngIf="!loading && !error && pastBookings.length > 0">
          <div class="section-label past-label">Past</div>
          <div class="booking-card past-card" *ngFor="let booking of pastBookings">
            <div class="card-top">
              <div class="card-info">
                <h3 class="client-name">{{ booking.clientName || 'Client' }}</h3>
                <p class="service-name" *ngIf="booking.serviceName">{{ booking.serviceName }}</p>
                <p class="service-name muted" *ngIf="!booking.serviceName">General appointment</p>
              </div>
              <span class="status-badge" [ngClass]="statusClass(booking.status)">
                {{ booking.status === 'CONFIRMED' ? 'Completed' : booking.status }}
              </span>
            </div>

            <div class="card-meta">
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {{ booking.slotDate | date:'MMMM d, y' }}
              </div>
              <div class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {{ booking.startTime }} – {{ booking.endTime }}
              </div>
            </div>

            <p class="notes" *ngIf="booking.notes">{{ booking.notes }}</p>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh;
      background: #F9FAFB;
      padding-top: 80px;
    }

    .container {
      max-width: 680px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .page-header {
      margin-bottom: 28px;
    }

    .page-header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 6px;
    }

    .page-header p {
      font-size: 15px;
      color: #6B7280;
      margin: 0;
    }

    /* Section labels */
    .section-label {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #4F46E5;
      margin-bottom: 12px;
      margin-top: 8px;
    }

    .section-label.past-label {
      color: #9CA3AF;
      margin-top: 32px;
    }

    .skel-label {
      height: 12px;
      width: 80px;
      background: #E5E7EB;
      border-radius: 4px;
      margin-bottom: 16px;
      animation: pulse 1.5s ease-in-out infinite;
    }

    /* Skeleton */
    .skeleton-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 24px;
      background: white;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      margin-bottom: 16px;
      animation: pulse 1.5s ease-in-out infinite;
    }

    .skel {
      background: #E5E7EB;
      border-radius: 4px;
    }

    .skel-title      { height: 20px; width: 55%; }
    .skel-text       { height: 14px; width: 100%; }
    .skel-text-short { height: 14px; width: 40%; }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.5; }
    }

    /* Booking card */
    .booking-card {
      background: white;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      padding: 20px 24px;
      margin-bottom: 16px;
    }

    .booking-card.past-card {
      opacity: 0.75;
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
    }

    .card-info { flex: 1; }

    .client-name {
      font-size: 17px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 4px;
    }

    .service-name {
      font-size: 14px;
      color: #6B7280;
      margin: 0;
    }

    .service-name.muted {
      font-style: italic;
      color: #9CA3AF;
    }

    /* Status badges */
    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .status-badge.pending {
      background: #FFFBEB;
      color: #92400E;
      border: 1px solid #FDE68A;
    }

    .status-badge.confirmed {
      background: #ECFDF5;
      color: #065F46;
      border: 1px solid #6EE7B7;
    }

    .status-badge.cancelled {
      background: #F9FAFB;
      color: #6B7280;
      border: 1px solid #E5E7EB;
    }

    /* Meta row */
    .card-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 12px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #6B7280;
      font-weight: 500;
    }

    .meta-item svg {
      color: #9CA3AF;
      flex-shrink: 0;
    }

    .notes {
      font-size: 13px;
      color: #6B7280;
      background: #F9FAFB;
      border-radius: 6px;
      padding: 8px 12px;
      margin: 0 0 12px;
    }

    /* Card actions */
    .card-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 8px;
      border-top: 1px solid #F3F4F6;
      margin-top: 4px;
    }

    .btn-complete {
      padding: 8px 18px;
      background: #4F46E5;
      border: none;
      border-radius: 6px;
      color: white;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
      min-height: 36px;
    }

    .btn-complete:hover:not(:disabled) {
      background: #4338CA;
    }

    .btn-complete:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-cancel {
      padding: 8px 18px;
      background: white;
      border: 1px solid #FCA5A5;
      border-radius: 6px;
      color: #DC2626;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
      min-height: 36px;
    }

    .btn-cancel:hover:not(:disabled) {
      background: #FEF2F2;
      border-color: #EF4444;
    }

    .btn-cancel:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Empty state */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 64px 24px;
      background: white;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      gap: 10px;
    }

    .empty-icon {
      font-size: 44px;
      margin-bottom: 4px;
    }

    .empty-state h2 {
      font-size: 20px;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .empty-state p {
      font-size: 15px;
      color: #6B7280;
      max-width: 340px;
      margin: 0;
    }

    /* Error banner */
    .error-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: #FEF2F2;
      border: 1px solid #FCA5A5;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 14px;
      color: #DC2626;
      margin-bottom: 16px;
    }

    .btn-retry {
      padding: 6px 14px;
      border: 1px solid #FCA5A5;
      border-radius: 6px;
      background: white;
      color: #DC2626;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      flex-shrink: 0;
    }

    .btn-retry:hover {
      background: #FEF2F2;
    }

    @media (max-width: 600px) {
      .container { padding: 20px 16px; }
      .card-meta { gap: 10px; }
      .card-actions { flex-direction: column; }
      .btn-complete, .btn-cancel { width: 100%; justify-content: center; }
    }
  `]
})
export class ProviderBookingsComponent implements OnInit {
  bookings: BookingResponse[] = [];
  loading = true;
  error = '';
  processingId: number | null = null;
  skeletons = [1, 2, 3];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.error = '';
    this.bookingService.getProviderBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load appointments. Please try again.';
        this.loading = false;
      }
    });
  }

  get upcomingBookings(): BookingResponse[] {
    const today = new Date().toISOString().split('T')[0];
    return this.bookings.filter(
      b => (b.status === 'PENDING' || b.status === 'CONFIRMED') && b.slotDate >= today
    );
  }

  get pastBookings(): BookingResponse[] {
    const today = new Date().toISOString().split('T')[0];
    return this.bookings.filter(
      b => b.status === 'CANCELLED' || b.slotDate < today
    );
  }

  markComplete(id: number): void {
    this.processingId = id;
    this.bookingService.completeBooking(id).subscribe({
      next: (updated) => {
        const idx = this.bookings.findIndex(b => b.id === id);
        if (idx !== -1) {
          this.bookings = [
            ...this.bookings.slice(0, idx),
            updated,
            ...this.bookings.slice(idx + 1)
          ];
        }
        this.processingId = null;
      },
      error: () => {
        this.processingId = null;
        this.error = 'Failed to mark appointment as complete. Please try again.';
      }
    });
  }

  cancelBooking(id: number): void {
    this.processingId = id;
    this.bookingService.cancelBookingByProvider(id).subscribe({
      next: () => {
        this.processingId = null;
        this.loadBookings();
      },
      error: () => {
        this.processingId = null;
        this.error = 'Failed to cancel appointment. Please try again.';
      }
    });
  }

  statusClass(status: string): string {
    return status.toLowerCase();
  }
}
