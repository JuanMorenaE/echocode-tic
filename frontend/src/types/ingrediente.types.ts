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

export const CATEGORIAS_PIZZA: { value: CategoriaIngrediente; label: string, multiple_select: boolean }[] = [
  { value: 'MASA', label: 'Masa', multiple_select: false },
  { value: 'SALSA', label: 'Salsa', multiple_select: false },
  { value: 'QUESO', label: 'Queso', multiple_select: true },
  { value: 'TOPPING', label: 'Topping', multiple_select: true },
];

export const CATEGORIAS_HAMBURGUESA: { value: CategoriaIngrediente; label: string, multiple_select: boolean }[] = [
  { value: 'PAN', label: 'Pan', multiple_select: false },
  { value: 'CARNE', label: 'Carne', multiple_select: false },
  { value: 'ADEREZO', label: 'Aderezo', multiple_select: true },
  { value: 'TOPPING', label: 'Topping', multiple_select: true },
];
