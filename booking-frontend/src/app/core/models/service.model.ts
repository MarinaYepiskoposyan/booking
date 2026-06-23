export interface BookingService {
  id: number;
  providerProfileId: number;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  currency: string;
  isActive: boolean;
}

export interface ServiceRequest {
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  currency: string;
}
