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
  | 'DRINK'
  | 'DESSERT'
  | 'OTHER';