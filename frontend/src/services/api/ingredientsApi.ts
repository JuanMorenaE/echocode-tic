import api from '@/lib/axios/axiosConfig';
import { Ingrediente } from '@/types/ingrediente.types';

export const ingredientsApi = {
  // Obtener todos los ingredientes
  getAll: async (): Promise<Ingrediente[]> => {
    const response = await api.get<Ingrediente[]>('/v1/ingredients');
    return response.data;
  },

  // Obtener ingredientes por tipo (BURGER o PIZZA)
  getByType: async (type: 'BURGER' | 'PIZZA'): Promise<Ingrediente[]> => {
    const response = await api.post<Ingrediente[]>('/v1/ingredients/type', type);
    return response.data;
  },

  // Crear un ingrediente
  create: async (ingrediente: Omit<Ingrediente, 'id'>): Promise<Ingrediente> => {
    const response = await api.post<Ingrediente>('/v1/ingredients', ingrediente);
    return response.data;
  },

  // Actualizar un ingrediente
  update: async (ingrediente: Ingrediente): Promise<Ingrediente> => {
    const response = await api.put<Ingrediente>('/v1/ingredients', ingrediente);
    return response.data;
  },

  // Eliminar un ingrediente
  delete: async (id: number): Promise<void> => {
    await api.delete(`/v1/ingredients/${id}`);
  },
};
