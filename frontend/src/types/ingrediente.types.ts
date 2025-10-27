export interface Ingrediente {
  id: number;
  name: string;
  category: CategoriaIngrediente;
  type: 'BURGER' | 'PIZZA';
  price: number;
  quantity: number; // Cuántas unidades incluye este ingrediente (ej: 1, 2 o 3 carnes)
  isEnabled: boolean;
}

export type CategoriaIngrediente =
  // Categorías para Pizzas
  | 'MASA'
  | 'SALSA'
  | 'QUESO'
  | 'TOPPING'
  // Categorías para Hamburguesas
  | 'PAN'
  | 'CARNE'
  | 'ADEREZO';

export const CATEGORIAS_PIZZA: { value: string; label: string }[] = [
  { value: 'MASA', label: 'Masa' },
  { value: 'SALSA', label: 'Salsa' },
  { value: 'QUESO', label: 'Queso' },
  { value: 'TOPPING', label: 'Topping' },
];

export const CATEGORIAS_HAMBURGUESA: { value: CategoriaIngrediente; label: string }[] = [
  { value: 'PAN', label: 'Pan' },
  { value: 'CARNE', label: 'Carne' },
  { value: 'ADEREZO', label: 'Aderezo' },
  { value: 'TOPPING', label: 'Topping' },
];
