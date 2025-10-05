'use client';

import { StatsCard } from '@/components/admin/StatsCard';
import { 
  ChartBarIcon, 
  PackageIcon, 
  UsersIcon, 
  ShoppingCartIcon 
} from '@/components/icons';
import { Card as TremorCard, Title, BarChart } from '@tremor/react';

export default function AdminDashboard() {
  // Datos de ejemplo
  const stats = [
    {
      title: 'Ventas del Mes',
      value: '$45,280',
      icon: <ChartBarIcon size={24} weight="fill" />,
      trend: { value: 12.5, isPositive: true },
      description: 'vs. mes anterior'
    },
    {
      title: 'Pedidos Totales',
      value: '328',
      icon: <PackageIcon size={24} weight="fill" />,
      trend: { value: 8.2, isPositive: true },
      description: 'este mes'
    },
    {
      title: 'Clientes Activos',
      value: '1,245',
      icon: <UsersIcon size={24} weight="fill" />,
      trend: { value: 3.1, isPositive: false },
      description: 'últimos 30 días'
    },
    {
      title: 'Pedidos Hoy',
      value: '23',
      icon: <ShoppingCartIcon size={24} weight="fill" />,
      description: 'en curso: 5'
    },
  ];

  const chartData = [
    { mes: 'Ene', ventas: 12400 },
    { mes: 'Feb', ventas: 15800 },
    { mes: 'Mar', ventas: 14200 },
    { mes: 'Abr', ventas: 18900 },
    { mes: 'May', ventas: 21300 },
    { mes: 'Jun', ventas: 25600 },
  ];

  const productosPopulares = [
    { nombre: 'Pizza Napolitana', cantidad: 45, ingreso: '$26,100' },
    { nombre: 'BBQ Bacon', cantidad: 38, ingreso: '$19,760' },
    { nombre: 'Pepperoni XL', cantidad: 32, ingreso: '$19,840' },
    { nombre: 'Mega Cheese', cantidad: 28, ingreso: '$13,440' },
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico de ventas */}
        <TremorCard>
          <Title>Ventas Mensuales</Title>
          <BarChart
            className="mt-6"
            data={chartData}
            index="mes"
            categories={["ventas"]}
            colors={["red"]}
            valueFormatter={(value) => `$${value.toLocaleString()}`}
            yAxisWidth={60}
          />
        </TremorCard>

        {/* Productos populares */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Productos Más Vendidos
          </h3>
          <div className="space-y-4">
            {productosPopulares.map((producto, index) => (
              <div key={producto.nombre} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{producto.nombre}</p>
                    <p className="text-sm text-gray-500">{producto.cantidad} vendidos</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">{producto.ingreso}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pedidos recientes */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Pedidos Recientes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cliente</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Producto</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Estado</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: '#1234', cliente: 'Juan Pérez', producto: 'Pizza Napolitana', estado: 'EN_PREPARACION', total: 580 },
                { id: '#1233', cliente: 'María García', producto: 'BBQ Bacon', estado: 'EN_CAMINO', total: 520 },
                { id: '#1232', cliente: 'Carlos López', producto: 'Pepperoni XL', estado: 'ENTREGADO', total: 620 },
              ].map((pedido) => (
                <tr key={pedido.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{pedido.id}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{pedido.cliente}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{pedido.producto}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      pedido.estado === 'ENTREGADO' 
                        ? 'bg-green-100 text-green-800'
                        : pedido.estado === 'EN_CAMINO'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {pedido.estado.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-gray-900 text-right">
                    ${pedido.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}