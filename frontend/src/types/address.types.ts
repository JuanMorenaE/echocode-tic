export interface Address {
  id: number;
  alias: string;
  street: string;
  number: string;
  apartmentNumber?: string;
  city: string;
  zipCode: string;
  additionalInfo?: string;
  isDefault: boolean;
}

export interface AddressRequest {
  alias: string;
  street: string;
  number: string;
  apartmentNumber?: string;
  city: string;
  zipCode: string;
  additionalInfo?: string;
  isDefault?: boolean;
}
