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
