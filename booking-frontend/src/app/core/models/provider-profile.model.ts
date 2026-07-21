export interface ProviderProfile {
  id: number;
  userId: number;
  businessName: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
}

export interface ProviderProfileRequest {
  businessName: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
}

export interface ProviderListItem {
  providerProfileId: number;
  businessName: string;
  description?: string;
  city?: string;
  serviceCount: number;
  services: string[];
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
