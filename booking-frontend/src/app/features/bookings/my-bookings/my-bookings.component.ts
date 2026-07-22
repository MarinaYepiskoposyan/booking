import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { BookingResponse } from '../../../core/models/booking.model';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="container">
        <div class="page-header">
          <h1>My Bookings</h1>
          <p>Manage your scheduled appointments</p>
        </div>

        <!-- Loading skeleton -->
        <ng-container *ngIf="loading">
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

        <!-- Global empty state (no bookings at all) -->
        <div class="empty-state" *ngIf="!loading && !error && bookings.length === 0">
          <div class="empty-icon">📅</div>
          <h2>No bookings yet</h2>
          <p>You haven't made any appointments. Find a provider and book your first slot!</p>
          <a routerLink="/providers" class="btn-primary">Find Providers</a>
        </div>

        <!-- Tabs + booking cards -->
        <ng-container *ngIf="!loading && !error && bookings.length > 0">

          <!-- Tab bar -->
          <div class="tabs" role="tablist">
            <button
              role="tab"
              class="tab"
              [class.active]="activeTab === 'upcoming'"
              (click)="activeTab = 'upcoming'">
              Upcoming Appointments
              <span class="tab-badge" *ngIf="upcomingBookings.length > 0">{{ upcomingBookings.length }}</span>
            </button>
            <button
              role="tab"
              class="tab"
              [class.active]="activeTab === 'past'"
              (click)="activeTab = 'past'">
              Past Appointments
              <span class="tab-badge past-badge" *ngIf="pastBookings.length > 0">{{ pastBookings.length }}</span>
            </button>
          </div>

          <!-- ── Upcoming tab ── -->
          <ng-container *ngIf="activeTab === 'upcoming'">
            <div class="tab-empty" *ngIf="upcomingBookings.length === 0">
              <p>You have no upcoming appointments.</p>
              <a routerLink="/providers" class="btn-primary">Find Providers</a>
            </div>

            <div class="booking-card" *ngFor="let booking of upcomingBookings">
              <div class="card-top">
                <div class="card-info">
                  <h3 class="provider-name">{{ booking.providerName }}</h3>
                  <p class="service-name" *ngIf="booking.serviceName">{{ booking.serviceName }}</p>
                  <p class="service-name muted" *ngIf="!booking.serviceName">General appointment</p>
                </div>
                <span class="status-badge" [ngClass]="statusClass(booking.status)">
                  {{ booking.status }}
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

              <div class="card-actions" *ngIf="canCancel(booking)">
                <button
                  class="btn-cancel"
                  [disabled]="cancellingId === booking.id"
                  (click)="cancelBooking(booking.id)">
                  {{ cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking' }}
                </button>
              </div>
            </div>
          </ng-container>

          <!-- ── Past tab ── -->
          <ng-container *ngIf="activeTab === 'past'">
            <div class="tab-empty" *ngIf="pastBookings.length === 0">
              <p>You have no past appointments.</p>
            </div>

            <div class="booking-card past-card" *ngFor="let booking of pastBookings">
              <div class="card-top">
                <div class="card-info">
                  <h3 class="provider-name">{{ booking.providerName }}</h3>
                  <p class="service-name" *ngIf="booking.serviceName">{{ booking.serviceName }}</p>
                  <p class="service-name muted" *ngIf="!booking.serviceName">General appointment</p>
                </div>
                <span class="status-badge" [ngClass]="statusClass(booking.status)">
                  {{ booking.status }}
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

    /* Tabs */
    .tabs {
      display: flex;
      gap: 4px;
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 10px;
      padding: 4px;
      margin-bottom: 20px;
    }

    .tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 16px;
      border: none;
      border-radius: 7px;
      background: transparent;
      color: #6B7280;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }

    .tab.active {
      background: #4F46E5;
      color: white;
    }

    .tab:not(.active):hover {
      background: #F3F4F6;
      color: #374151;
    }

    .tab-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 700;
      background: rgba(255,255,255,0.25);
      color: inherit;
    }

    .tab:not(.active) .tab-badge {
      background: #E5E7EB;
      color: #374151;
    }

    .tab:not(.active) .past-badge {
      background: #E5E7EB;
      color: #374151;
    }

    /* Per-tab empty state */
    .tab-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 40px 24px;
      background: white;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      text-align: center;
      color: #6B7280;
      font-size: 15px;
    }

    .tab-empty p {
      margin: 0;
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

    .past-card {
      opacity: 0.85;
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
    }

    .card-info { flex: 1; }

    .provider-name {
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

    .card-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: 8px;
      border-top: 1px solid #F3F4F6;
      margin-top: 4px;
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

    /* Global empty state */
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

    .btn-primary {
      margin-top: 8px;
      padding: 10px 24px;
      background: #4F46E5;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: background 0.2s;
    }

    .btn-primary:hover {
      background: #4338CA;
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
      .tab { font-size: 13px; padding: 9px 12px; }
    }
  `]
})
export class MyBookingsComponent implements OnInit {
  bookings: BookingResponse[] = [];
  loading = true;
  error = '';
  cancellingId: number | null = null;
  activeTab: 'upcoming' | 'past' = 'upcoming';
  skeletons = [1, 2, 3];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.error = '';
    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load bookings. Please try again.';
        this.loading = false;
      }
    });
  }

  cancelBooking(id: number): void {
    this.cancellingId = id;
    this.bookingService.cancelBooking(id).subscribe({
      next: () => {
        const booking = this.bookings.find(b => b.id === id);
        if (booking) {
          booking.status = 'CANCELLED';
        }
        this.cancellingId = null;
        // Switch to past tab so user sees the cancelled booking moved there
        this.activeTab = 'past';
      },
      error: () => {
        this.cancellingId = null;
        this.error = 'Failed to cancel booking. Please try again.';
      }
    });
  }

  private get todayStr(): string {
    return new Date().toISOString().split('T')[0];
  }

  get upcomingBookings(): BookingResponse[] {
    const today = this.todayStr;
    return this.bookings.filter(b =>
      (b.status === 'PENDING' || b.status === 'CONFIRMED') && b.slotDate >= today
    );
  }

  get pastBookings(): BookingResponse[] {
    const today = this.todayStr;
    return this.bookings.filter(b =>
      b.status === 'CANCELLED' || b.slotDate < today
    );
  }

  canCancel(booking: BookingResponse): boolean {
    return booking.status === 'PENDING' && booking.slotDate >= this.todayStr;
  }

  statusClass(status: string): string {
    return status.toLowerCase();
  }
}
