'use client';

import { useEffect, useState } from 'react';
import { StatsCard } from '@/components/admin/StatsCard';
import {
  ChartBarIcon,
  PackageIcon,
  UsersIcon
} from '@/components/icons';
import { adminApi, AdminStatsResponse } from '@/services/api/adminApi';
import { Loading } from '@/components/ui/Loading';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getStats();
        setStats(data);
      } catch (err: any) {
        console.error('Error fetching admin stats:', err);
        setError(err.response?.data?.message || 'Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error || 'Error al cargar estadísticas'}
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Ventas Totales',
      value: `$${stats.totalSales.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <ChartBarIcon size={24} weight="fill" />,
      description: 'todas las ventas'
    },
    {
      title: 'Pedidos Totales',
      value: stats.totalOrders.toString(),
      icon: <PackageIcon size={24} weight="fill" />,
      description: 'todos los pedidos'
    },
    {
      title: 'Total de Clientes',
      value: stats.totalClients.toString(),
      icon: <UsersIcon size={24} weight="fill" />,
      description: 'clientes registrados'
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Bienvenido al panel de administración
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsCards.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Pedidos entregados */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Pedidos Entregados
        </h3>
        {stats.deliveredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cliente</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fecha</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.deliveredOrders.map((pedido) => (
                  <tr key={pedido.orderId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">#{pedido.orderId}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{pedido.clientName}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(pedido.orderDate).toLocaleDateString('es-UY', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-gray-900 text-right">
                      ${pedido.total.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No hay pedidos entregados aún</p>
        )}
      </div>
    </div>
  );
}
