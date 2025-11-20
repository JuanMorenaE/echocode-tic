import api from '@/lib/axios/axiosConfig';
import { Producto } from '@/types/producto.types';

export const productsApi = {
  // Obtener todos los productos
  getAll: async (): Promise<Producto[]> => {
    const response = await api.get<Producto[]>('/v1/products');
    return response.data;
  },

  // Crear un producto
  create: async (producto: Omit<Producto, 'id'>): Promise<Producto> => {
    const response = await api.post<Producto>('/v1/products', producto);
    return response.data;
  },

  // Actualizar un producto
  update: async (id: number, producto: Partial<Producto>): Promise<Producto> => {
    const response = await api.put<Producto>(`/v1/products/${id}`, producto);
    return response.data;
  },

  // Eliminar un producto
  delete: async (id: number): Promise<void> => {
    await api.delete(`/v1/products/${id}`);
  },
};
