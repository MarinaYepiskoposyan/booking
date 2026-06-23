import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProviderProfile, ProviderProfileRequest } from '../models/provider-profile.model';

@Injectable({ providedIn: 'root' })
export class ProviderProfileService {
  private readonly baseUrl = `${environment.apiUrl}/provider/profile`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ProviderProfile> {
    return this.http.get<ProviderProfile>(this.baseUrl);
  }

  createOrUpdateProfile(request: ProviderProfileRequest): Observable<ProviderProfile> {
    return this.http.post<ProviderProfile>(this.baseUrl, request);
  }
}
