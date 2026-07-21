import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ProviderService } from '../../../core/services/provider.service';
import { ProviderListItem, Page } from '../../../core/models/provider-profile.model';

const CITIES = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
  'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
  'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte',
  'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Boston',
  'Nashville', 'Baltimore', 'Louisville', 'Portland', 'Las Vegas',
  'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento',
  'London', 'Paris', 'Berlin', 'Madrid', 'Rome',
  'Amsterdam', 'Toronto', 'Sydney', 'Melbourne', 'Tokyo',
];

@Component({
  selector: 'app-provider-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './provider-list.component.html',
  styles: [`
    .providers-page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 6px;
    }

    .page-header p {
      font-size: 15px;
      color: #6B7280;
    }

    .filters-bar {
      display: flex;
      gap: 12px;
      margin-bottom: 28px;
      flex-wrap: wrap;
    }

    .search-wrap {
      flex: 1;
      min-width: 200px;
      position: relative;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #9CA3AF;
      font-size: 16px;
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 10px 14px 10px 36px;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      font-size: 14px;
      color: #111827;
      background: white;
      box-sizing: border-box;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: #4F46E5;
      box-shadow: 0 0 0 3px rgba(79,70,229,0.12);
    }

    .city-select {
      padding: 10px 14px;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      font-size: 14px;
      color: #111827;
      background: white;
      min-width: 180px;
      transition: border-color 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }

    .city-select:focus {
      outline: none;
      border-color: #4F46E5;
      box-shadow: 0 0 0 3px rgba(79,70,229,0.12);
    }

    .results-meta {
      font-size: 13px;
      color: #6B7280;
      margin-bottom: 16px;
    }

    /* Skeleton */
    .provider-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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

    .skel-title  { height: 20px; width: 60%; }
    .skel-city   { height: 14px; width: 30%; }
    .skel-text   { height: 13px; width: 100%; }
    .skel-text-short { height: 13px; width: 75%; }
    .skel-badges { height: 26px; width: 50%; margin-top: 4px; }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.5; }
    }

    /* Provider card */
    .provider-card {
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: box-shadow 0.2s, transform 0.2s;
      cursor: default;
    }

    .provider-card:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.10);
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }

    .business-name {
      font-size: 18px;
      font-weight: 700;
      color: #111827;
      line-height: 1.3;
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
      white-space: nowrap;
      flex-shrink: 0;
    }

    .description {
      font-size: 14px;
      color: #6B7280;
      line-height: 1.55;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .description.muted {
      font-style: italic;
      color: #9CA3AF;
    }

    .services-section {
      margin-top: 4px;
    }

    .services-label {
      font-size: 12px;
      font-weight: 600;
      color: #9CA3AF;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }

    .service-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .service-tag {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 100px;
      font-size: 12px;
      color: #374151;
      font-weight: 500;
    }

    .service-count {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      background: #ECFDF5;
      border-radius: 100px;
      font-size: 12px;
      color: #10B981;
      font-weight: 500;
    }

    .no-services {
      font-size: 13px;
      color: #9CA3AF;
      font-style: italic;
    }

    /* Empty state */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 72px 24px;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      gap: 10px;
    }

    .empty-icon {
      font-size: 44px;
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
      max-width: 340px;
    }

    .btn-clear {
      margin-top: 8px;
      padding: 9px 20px;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      background: white;
      color: #4F46E5;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
    }

    .btn-clear:hover {
      background: #EEF2FF;
      border-color: #4F46E5;
    }

    /* Pagination */
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 36px;
    }

    .btn-page {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 9px 18px;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      background: white;
      color: #374151;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, color 0.2s;
      min-height: 40px;
    }

    .btn-page:hover:not(:disabled) {
      background: #EEF2FF;
      border-color: #4F46E5;
      color: #4F46E5;
    }

    .btn-page:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .page-info {
      font-size: 14px;
      color: #6B7280;
      padding: 0 8px;
    }

    @media (max-width: 600px) {
      .providers-page {
        padding: 20px 16px;
      }
      .filters-bar {
        flex-direction: column;
      }
      .city-select {
        width: 100%;
      }
    }
  `]
})
export class ProviderListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  filterForm: FormGroup;
  cities = CITIES;

  providers: ProviderListItem[] = [];
  loading = true;
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 10;

  skeletons = [1, 2, 3];

  constructor(private fb: FormBuilder, private providerService: ProviderService) {
    this.filterForm = this.fb.group({
      search: [''],
      city: ['']
    });
  }

  ngOnInit(): void {
    this.filterForm.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged((a, b) => a.search === b.search && a.city === b.city),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadProviders();
    });

    this.loadProviders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProviders(): void {
    this.loading = true;
    const { search, city } = this.filterForm.value;

    this.providerService.getProviders(this.currentPage, this.pageSize, search, city).subscribe({
      next: (page) => {
        this.providers = page.content;
        this.totalPages = page.totalPages;
        this.totalElements = page.totalElements;
        this.loading = false;
      },
      error: () => {
        this.providers = [];
        this.loading = false;
      }
    });
  }

  goToPrevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadProviders();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadProviders();
    }
  }

  clearFilters(): void {
    this.filterForm.reset({ search: '', city: '' });
  }

  get hasFilters(): boolean {
    const { search, city } = this.filterForm.value;
    return !!(search?.trim() || city?.trim());
  }
}
