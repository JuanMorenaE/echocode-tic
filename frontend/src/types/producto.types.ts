export interface Producto {
  id: number;
  name: string;
  price: number;
  description: string;
  type?: ProductType;
  category?: string;
  isAvailable: boolean;
  imageUrl?: string;
}

export type ProductType =
  | 'SIDE'
  | 'DRINK';

export const PRODUCT_TYPES: { value: ProductType; label: string }[] = [
  { value: 'SIDE', label: 'ACOMPAÑAMIENTO' },
  { value: 'DRINK', label: 'BEBIDA' },
];