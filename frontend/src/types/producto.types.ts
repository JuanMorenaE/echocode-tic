export interface Producto {
  id: number;
  name: string;
  price: number;
  description: string;
  tipo?: string;
  badge?: {
    text: string;
    color: string;
  };
}

export type ProductCategory = 'hamburguesas' | 'pizzas' | 'acompañamientos' | 'bebidas';