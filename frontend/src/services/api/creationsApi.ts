import api from '@/lib/axios/axiosConfig';
import '@/lib/axios/interceptors';

export interface CreationRequestDTO {
  name: string;
  creationType: 'BURGER' | 'PIZZA';
  isFavourite: boolean;
  ingredientIds: number[];
}

export interface CreationResponseDTO {
  creationId: number;
  name: string;
  creationType: string;
  isFavourite: boolean;
  ingredients: any[]; // Puedes tipar mejor según tu Ingrediente
  totalPrice: number;
}

const creationsApi = {
  async createCreation(data: CreationRequestDTO): Promise<CreationResponseDTO> {
    try {
      const response = await api.post<CreationResponseDTO>('/v1/creations', data);
      return response.data;
    } catch (error: unknown) {
      const e = error as { response?: { data?: { message?: string } }; message?: string } | undefined;
      const message = e?.response?.data?.message ?? e?.message ?? 'Error creating creation';
      throw new Error(message);
    }
  },

  async getFavorites(): Promise<CreationResponseDTO[]> {
    try {
      const response = await api.get<CreationResponseDTO[]>('/v1/creations/favorites');
      return response.data;
    } catch (error: unknown) {
      const e = error as { response?: { data?: { message?: string } }; message?: string } | undefined;
      const message = e?.response?.data?.message ?? e?.message ?? 'Error fetching favorites';
      throw new Error(message);
    }
  },

  async getAllCreations(): Promise<CreationResponseDTO[]> {
    const response = await api.get<CreationResponseDTO[]>('/v1/creations');
    return response.data;
  },

  async getCreationById(id: number): Promise<CreationResponseDTO> {
    const response = await api.get<CreationResponseDTO>(`/v1/creations/${id}`);
    return response.data;
  },

  async deleteCreation(id: number): Promise<void> {
    try {
      await api.delete(`/v1/creations/${id}`);
    } catch (error: unknown) {
      const e = error as { response?: { data?: { message?: string } }; message?: string } | undefined;
      const message = e?.response?.data?.message ?? e?.message ?? 'Error deleting creation';
      throw new Error(message);
    }
  },
};

export default creationsApi;
