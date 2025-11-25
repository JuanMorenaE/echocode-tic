import api from '@/lib/axios/axiosConfig';
import '@/lib/axios/interceptors';
import type { Card, CardRequest } from '@/types/card.types';

const cardApi = {
  async getAll(): Promise<Card[]> {
    const res = await api.get<Card[]>('/v1/cards');
    return res.data;
  },

  async getById(id: number): Promise<Card> {
    const res = await api.get<Card>(`/v1/cards/${id}`);
    return res.data;
  },

  async create(card: CardRequest): Promise<Card> {
    const res = await api.post<Card>('/v1/cards', card);
    return res.data;
  },

  async update(id: number, card: CardRequest): Promise<Card> {
    const res = await api.put<Card>(`/v1/cards/${id}`, card);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/v1/cards/${id}`);
  },
};

export default cardApi;
