import api from '@/lib/axios/axiosConfig';
import '@/lib/axios/interceptors';
import type { Address, AddressRequest } from '@/types/address.types';

const addressApi = {
  async getAll(): Promise<Address[]> {
    const res = await api.get<Address[]>('/v1/addresses');
    return res.data;
  },

  async getById(id: number): Promise<Address> {
    const res = await api.get<Address>(`/v1/addresses/${id}`);
    return res.data;
  },

  async create(address: AddressRequest): Promise<Address> {
    const res = await api.post<Address>('/v1/addresses', address);
    return res.data;
  },

  async update(id: number, address: AddressRequest): Promise<Address> {
    const res = await api.put<Address>(`/v1/addresses/${id}`, address);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/v1/addresses/${id}`);
  },
};

export default addressApi;
