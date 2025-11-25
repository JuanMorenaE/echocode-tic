import { Ingrediente } from './ingrediente.types';

export type OrderStatus =
  | 'QUEUED'
  | 'PREPARING'
  | 'ON_THE_WAY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderProductItem {
  productId: number;
  quantity: number;
}

export interface OrderCreationItem {
  creationId: number;
  quantity: number;
}

export interface OrderRequest {
  creations?: OrderCreationItem[];
  products?: OrderProductItem[];
  addressId?: number;
  cardId?: number;
  notes?: string;
}

export interface CreationResponse {
  creationId: number;
  name: string;
  creationType: 'BURGER' | 'PIZZA';
  isFavourite: boolean;
  ingredients: Ingrediente[];
  totalPrice: number;
  quantity: number;
}

export interface OrderProductResponse {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  productType: "SIDE" | "DRINK";
}

export interface AddressResponse {
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

export interface CardResponse {
  id: number;
  alias: string;
  cardholderName: string;
  last4Digits: string;
  expirationDate: string;
  cardType: string;
  isDefault: boolean;
}

export interface OrderResponse {
  orderId: number;
  orderHash: string;
  orderStatus: OrderStatus;
  orderDate: string; // ISO date string
  total: number;
  notes?: string;
  deliveryAddress?: AddressResponse;
  paymentCard?: CardResponse;
  creations: CreationResponse[];
  products: OrderProductResponse[];
}

// Mapeo de estados para UI
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  QUEUED: 'En Cola',
  PREPARING: 'En Preparación',
  ON_THE_WAY: 'En Camino',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

// Colores para estados
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  QUEUED: 'bg-yellow-100 text-yellow-800',
  PREPARING: 'bg-blue-100 text-blue-800',
  ON_THE_WAY: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};
