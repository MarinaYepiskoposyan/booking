import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProviderService } from '../../../core/services/provider.service';
import { ProviderDetail, TimeSlot } from '../../../core/models/provider-profile.model';

@Component({
  selector: 'app-provider-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './provider-detail.component.html',
  styles: [`
    .detail-page {
      max-width: 860px;
      margin: 0 auto;
      padding: 32px 24px;
      font-family: 'Inter', sans-serif;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #4F46E5;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      margin-bottom: 24px;
      transition: opacity 0.2s;
    }

    .back-link:hover { opacity: 0.75; }

    /* ── Skeleton ─────────────────────────────── */
    .skeleton-wrap { display: flex; flex-direction: column; gap: 16px; }
    .skel { background: #E5E7EB; border-radius: 4px; animation: pulse 1.5s ease-in-out infinite; }
    .skel-h1   { height: 28px; width: 55%; }
    .skel-sub  { height: 16px; width: 30%; }
    .skel-p    { height: 13px; width: 100%; }
    .skel-p-s  { height: 13px; width: 75%; }
    .skel-card { height: 80px; border-radius: 8px; }
    @keyframes pulse { 0%,100%{ opacity:1 } 50%{ opacity:0.45 } }

    /* ── Error ────────────────────────────────── */
    .error-box {
      background: #FEF2F2;
      border: 1px solid #FECACA;
      border-radius: 12px;
      padding: 40px 24px;
      text-align: center;
      color: #B91C1C;
    }
    .error-box h2 { margin-bottom: 8px; font-size: 20px; }
    .error-box p { font-size: 14px; color: #6B7280; }

    /* ── Provider header ──────────────────────── */
    .provider-header {
      background: #ffffff;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      padding: 28px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      margin-bottom: 24px;
    }

    .provider-header h1 {
      font-size: 26px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 8px;
    }

    .meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
      margin-bottom: 14px;
    }

    .city-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 10px;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 500;
      background: #EEF2FF;
      color: #4F46E5;
    }

    .address-text {
      font-size: 13px;
      color: #6B7280;
    }

    .website-link {
      font-size: 13px;
      color: #4F46E5;
      text-decoration: none;
      font-weight: 500;
    }
    .website-link:hover { text-decoration: underline; }

    .description-text {
      font-size: 14px;
      color: #374151;
      line-height: 1.6;
    }

    /* ── Section header ───────────────────────── */
    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 14px;
    }

    /* ── Services ─────────────────────────────── */
    .services-section {
      margin-bottom: 28px;
    }

    .no-services {
      font-size: 14px;
      color: #9CA3AF;
      font-style: italic;
    }

    .service-card {
      background: #ffffff;
      border: 1px solid #E5E7EB;
      border-radius: 10px;
      padding: 18px 20px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .service-info { flex: 1; }

    .service-name {
      font-size: 15px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 4px;
    }

    .service-desc {
      font-size: 13px;
      color: #6B7280;
      line-height: 1.5;
      margin-bottom: 6px;
    }

    .service-meta {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .service-meta-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 500;
      color: #6B7280;
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 100px;
      padding: 3px 10px;
    }

    .btn-book-service {
      padding: 8px 16px;
      border-radius: 7px;
      border: 1px solid #C7D2FE;
      background: #EEF2FF;
      color: #4F46E5;
      font-size: 13px;
      font-weight: 600;
      cursor: not-allowed;
      opacity: 0.65;
      white-space: nowrap;
      flex-shrink: 0;
      position: relative;
    }

    /* ── Date picker section ──────────────────── */
    .slots-section {
      background: #ffffff;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }

    .date-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .date-label {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      white-space: nowrap;
    }

    .date-input {
      padding: 9px 13px;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      font-size: 14px;
      color: #111827;
      background: white;
      transition: border-color 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }

    .date-input:focus {
      outline: none;
      border-color: #4F46E5;
      box-shadow: 0 0 0 3px rgba(79,70,229,0.12);
    }

    /* ── Slots loading ────────────────────────── */
    .slots-loading {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #6B7280;
      font-size: 14px;
      padding: 12px 0;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid #E5E7EB;
      border-top-color: #4F46E5;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      flex-shrink: 0;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Slots grid ───────────────────────────── */
    .slots-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 20px;
    }

    .slot-chip {
      padding: 7px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.15s;
      user-select: none;
    }

    .slot-chip.available {
      background: #EEF2FF;
      border-color: #C7D2FE;
      color: #4338CA;
    }

    .slot-chip.available:hover {
      background: #4F46E5;
      border-color: #4F46E5;
      color: white;
    }

    .slot-chip.selected {
      background: #4F46E5;
      border-color: #4F46E5;
      color: white;
      box-shadow: 0 0 0 3px rgba(79,70,229,0.25);
    }

    .slot-chip.booked {
      background: #F3F4F6;
      border-color: #E5E7EB;
      color: #9CA3AF;
      cursor: not-allowed;
      text-decoration: line-through;
    }

    .no-slots {
      font-size: 14px;
      color: #9CA3AF;
      font-style: italic;
      padding: 8px 0;
    }

    /* ── Book button ──────────────────────────── */
    .btn-book-slot {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 11px 24px;
      border-radius: 8px;
      border: none;
      background: #4F46E5;
      color: white;
      font-size: 15px;
      font-weight: 600;
      cursor: not-allowed;
      opacity: 0.65;
      transition: background 0.2s;
    }

    .slots-prompt {
      font-size: 13px;
      color: #6B7280;
      margin-top: 6px;
    }

    @media (max-width: 600px) {
      .detail-page { padding: 20px 16px; }
      .service-card { flex-direction: column; }
      .btn-book-service { align-self: flex-start; }
    }
  `]
})
export class ProviderDetailComponent implements OnInit {
  provider: ProviderDetail | null = null;
  loading = true;
  error = false;

  selectedDate = '';
  minDate = '';

  slots: TimeSlot[] = [];
  slotsLoading = false;
  slotsLoaded = false;
  selectedSlotId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private providerService: ProviderService
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.providerService.getProviderById(id).subscribe({
      next: (data) => {
        this.provider = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  onDateChange(): void {
    if (!this.selectedDate || !this.provider) return;
    this.slotsLoading = true;
    this.slotsLoaded = false;
    this.selectedSlotId = null;
    this.slots = [];

    this.providerService.getAvailableSlots(this.provider.providerProfileId, this.selectedDate).subscribe({
      next: (data) => {
        this.slots = data;
        this.slotsLoading = false;
        this.slotsLoaded = true;
      },
      error: () => {
        this.slots = [];
        this.slotsLoading = false;
        this.slotsLoaded = true;
      }
    });
  }

  selectSlot(slot: TimeSlot): void {
    if (slot.status !== 'AVAILABLE') return;
    this.selectedSlotId = this.selectedSlotId === slot.id ? null : slot.id;
  }

  isSelected(slot: TimeSlot): boolean {
    return this.selectedSlotId === slot.id;
  }

  slotClass(slot: TimeSlot): string {
    if (slot.status !== 'AVAILABLE') return 'slot-chip booked';
    if (this.selectedSlotId === slot.id) return 'slot-chip selected';
    return 'slot-chip available';
  }

  formatPrice(price: number, currency: string): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
  }
}
