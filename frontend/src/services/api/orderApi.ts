import '@/lib/axios/interceptors';
import api from '@/lib/axios/axiosConfig';
import type { OrderRequest, OrderResponse } from '@/types/order.types';
import { AxiosError } from 'axios';

const orderApi = {
  async create(payload: OrderRequest): Promise<OrderResponse> {
    try {
      const res = await api.post<OrderResponse>('/v1/orders', payload);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 401) {
          throw new Error('Debes iniciar sesión para crear un pedido');
        } else if (status === 400) {
          throw new Error(message || 'Datos del pedido inválidos');
        } else if (status === 403) {
          throw new Error('No tienes permiso para realizar esta acción');
        } else if (status === 404) {
          throw new Error(message || 'Algunos productos o creaciones no fueron encontrados');
        } else if (status === 500) {
          throw new Error('Error del servidor. Por favor intenta más tarde.');
        } else if (message) {
          throw new Error(message);
        }
      }
      throw new Error('Error al crear el pedido. Verifica tu conexión.');
    }
  },

  async getById(orderId: number): Promise<OrderResponse> {
    try {
      const res = await api.get<OrderResponse>(`/v1/orders/${orderId}`);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 401) {
          throw new Error('Debes iniciar sesión para ver este pedido');
        } else if (status === 403) {
          throw new Error('No tienes permiso para ver este pedido');
        } else if (status === 404) {
          throw new Error('Pedido no encontrado');
        } else if (message) {
          throw new Error(message);
        }
      }
      throw new Error('Error al obtener el pedido');
    }
  },

  async getMyOrders(): Promise<OrderResponse[]> {
    try {
      const res = await api.get<OrderResponse[]>('/v1/orders');
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 401) {
          throw new Error('Debes iniciar sesión para ver tus pedidos');
        } else if (message) {
          throw new Error(message);
        }
      }
      throw new Error('Error al obtener los pedidos');
    }
  },

  async updateStatus(orderId: number, newStatus: string): Promise<OrderResponse> {
    try {
      const res = await api.patch<OrderResponse>(`/v1/orders/${orderId}/status`, {
        status: newStatus,
      });
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 401) {
          throw new Error('Debes iniciar sesión');
        } else if (status === 400) {
          throw new Error(message || 'Estado inválido');
        } else if (status === 404) {
          throw new Error('Pedido no encontrado');
        } else if (message) {
          throw new Error(message);
        }
      }
      throw new Error('Error al actualizar el estado del pedido');
    }
  },

  async cancelOrder(orderId: number): Promise<OrderResponse> {
    try {
      const res = await api.post<OrderResponse>(`/v1/orders/${orderId}/cancel`);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 401) {
          throw new Error('Debes iniciar sesión para cancelar el pedido');
        } else if (status === 403) {
          throw new Error('No tienes permiso para cancelar este pedido');
        } else if (status === 404) {
          throw new Error('Pedido no encontrado');
        } else if (status === 400) {
          throw new Error(message || 'No se puede cancelar este pedido en su estado actual');
        } else if (message) {
          throw new Error(message);
        }
      }
      throw new Error('Error al cancelar el pedido');
    }
  },
};

export default orderApi;
