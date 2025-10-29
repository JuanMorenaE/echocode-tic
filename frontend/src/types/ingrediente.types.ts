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

export const CATEGORIAS_PIZZA: { value: CategoriaIngrediente; label: string, multiple_select: boolean, required: boolean, order: number }[] = [
  { value: 'MASA', label: 'Masa', multiple_select: false, required: true, order: 1 },
  { value: 'SALSA', label: 'Salsa', multiple_select: false, required: true, order: 2 },
  { value: 'QUESO', label: 'Queso', multiple_select: true, required: false, order: 3 },
  { value: 'TOPPING', label: 'Topping', multiple_select: true, required: false, order: 4 },
];

export const CATEGORIAS_HAMBURGUESA: { value: CategoriaIngrediente; label: string, multiple_select: boolean, required: boolean, order: number }[] = [
  { value: 'PAN', label: 'Pan', multiple_select: false, required: true, order: 1 },
  { value: 'CARNE', label: 'Carne', multiple_select: false, required: true, order: 2 },
  { value: 'ADEREZO', label: 'Aderezo', multiple_select: true, required: false, order: 3 },
  { value: 'TOPPING', label: 'Topping', multiple_select: true, required: false, order: 4 },
];
