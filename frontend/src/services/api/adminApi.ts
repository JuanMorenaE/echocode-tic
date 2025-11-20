import api from '@/lib/axios/axiosConfig';

export interface DeliveredOrderDto {
  orderId: number;
  clientName: string;
  total: number;
  orderDate: string;
}

export interface AdminStatsResponse {
  totalSales: number;
  totalOrders: number;
  totalClients: number;
  deliveredOrders: DeliveredOrderDto[];
}

export const adminApi = {
  // Obtener estadísticas del dashboard
  getStats: async (): Promise<AdminStatsResponse> => {
    const response = await api.get<AdminStatsResponse>('/v1/admin/stats');
    return response.data;
  },
};
