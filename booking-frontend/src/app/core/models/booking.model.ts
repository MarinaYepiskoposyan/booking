export interface BookingRequest {
  timeSlotId: number;
  serviceId?: number;
  notes?: string;
}

export interface BookingResponse {
  id: number;
  clientName?: string;
  providerName: string;
  serviceName?: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
}
