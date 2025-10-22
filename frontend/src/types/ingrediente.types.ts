import { Category } from "./category.types";

export interface Ingrediente {
  id: number;
  nombre: string;
  categoria?: Category;
  tipoProducto: 'BURGER' | 'PIZZA';
  precio: number;
  cantidad: number; // Cuántas unidades incluye este ingrediente (ej: 1, 2 o 3 carnes)
  disponible?: boolean;
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
  | 'ADEREZO'
  | 'VEGETAL'
  | 'EXTRA';

export const CATEGORIAS_PIZZA: { value: CategoriaIngrediente; label: string }[] = [
  { value: 'MASA', label: 'Masa' },
  { value: 'SALSA', label: 'Salsa' },
  { value: 'QUESO', label: 'Queso' },
  { value: 'TOPPING', label: 'Topping' },
];

export const CATEGORIAS_HAMBURGUESA: { value: CategoriaIngrediente; label: string }[] = [
  { value: 'PAN', label: 'Pan' },
  { value: 'CARNE', label: 'Carne' },
  { value: 'ADEREZO', label: 'Aderezo' },
  { value: 'VEGETAL', label: 'Vegetal' },
  { value: 'EXTRA', label: 'Extra' },
];
