import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BookingService, ServiceRequest } from '../models/service.model';

@Injectable({ providedIn: 'root' })
export class BookingServiceService {
  private readonly baseUrl = `${environment.apiUrl}/provider/services`;

  constructor(private http: HttpClient) {}

  getMyServices(): Observable<BookingService[]> {
    return this.http.get<{ content: BookingService[] }>(this.baseUrl).pipe(
      map(page => page.content)
    );
  }

  getServiceById(id: number): Observable<BookingService> {
    return this.http.get<BookingService>(`${this.baseUrl}/${id}`);
  }

  addService(request: ServiceRequest): Observable<BookingService> {
    return this.http.post<BookingService>(this.baseUrl, request);
  }

  updateService(serviceId: number, request: ServiceRequest): Observable<BookingService> {
    return this.http.put<BookingService>(`${this.baseUrl}/${serviceId}`, request);
  }

  deleteService(serviceId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${serviceId}`);
  }
}
