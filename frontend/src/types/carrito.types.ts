import { Ingrediente } from './ingrediente.types';

export type TipoItemCarrito = 'CREACION' | 'PRODUCTO';

export interface CreacionCarrito {
  id?: number; // ID de la creación en el backend (solo para favoritos guardados)
  tipo: 'PIZZA' | 'HAMBURGUESA';
  nombre: string;
  ingredientes: Ingrediente[];
  esFavorito: boolean;
}

export interface ProductoCarrito {
  id: number;
  nombre: string;
  tipo: 'SIDE' | 'DRINK';
  precio: number;
  descripcion?: string;
}

export interface ItemCarrito {
  id: string; // UUID generado localmente
  tipoItem: TipoItemCarrito;
  creacion?: CreacionCarrito;
  producto?: ProductoCarrito;
  cantidad: number;
  precioUnitario: number;
  precioTotal: number;
}

export interface Carrito {
  items: ItemCarrito[];
  cantidadTotal: number;
  precioTotal: number;
}
