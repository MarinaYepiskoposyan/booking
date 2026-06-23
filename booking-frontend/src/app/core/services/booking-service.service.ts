import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BookingService, ServiceRequest } from '../models/service.model';

@Injectable({ providedIn: 'root' })
export class BookingServiceService {
  private readonly baseUrl = `${environment.apiUrl}/provider/services`;

  constructor(private http: HttpClient) {}

  getMyServices(): Observable<BookingService[]> {
    return this.http.get<BookingService[]>(this.baseUrl);
  }

  addService(request: ServiceRequest): Observable<BookingService> {
    return this.http.post<BookingService>(this.baseUrl, request);
  }

  updateService(serviceId: number, request: ServiceRequest): Observable<BookingService> {
    return this.http.put<BookingService>(`${this.baseUrl}/${serviceId}`, request);
  }
}
