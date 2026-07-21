import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Page, ProviderDetail, ProviderListItem, TimeSlot } from '../models/provider-profile.model';

@Injectable({ providedIn: 'root' })
export class ProviderService {
  private readonly baseUrl = `${environment.apiUrl}/providers`;

  constructor(private http: HttpClient) {}

  getProviders(page: number, size: number, search?: string, city?: string): Observable<Page<ProviderListItem>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    if (city && city.trim()) {
      params = params.set('city', city.trim());
    }
    return this.http.get<Page<ProviderListItem>>(this.baseUrl, { params });
  }

  getProviderById(id: number): Observable<ProviderDetail> {
    return this.http.get<ProviderDetail>(`${this.baseUrl}/${id}`);
  }

  getAvailableSlots(providerProfileId: number, date: string): Observable<TimeSlot[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<TimeSlot[]>(`${environment.apiUrl}/slots/${providerProfileId}`, { params });
  }
}
