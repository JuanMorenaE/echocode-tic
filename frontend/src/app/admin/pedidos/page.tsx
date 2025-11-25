'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { PedidosTable } from '@/components/admin/PedidosTable';
import AdminOrderDetailModal from '@/components/admin/AdminOrderDetailModal';
import { useToast } from '@/context/ToastContext';
import orderApi from '@/services/api/orderApi';
import {
  OrderResponse,
  OrderStatus,
} from '@/types/order.types';
import {
  MagnifyingGlassIcon,
} from '@/components/icons';
import { SpinnerGapIcon } from '@phosphor-icons/react';

const AdminPedidosPage = () => {
  const { error: showError } = useToast();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderApi.getAllOrders();
      setOrders(data);
    } catch (err: any) {
      console.error('Error cargando pedidos:', err);
      showError(err.message || 'Error al cargar los pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (order: OrderResponse) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleOrderUpdated = () => {
    loadOrders();
  };

  // Aplicar filtros
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' ||
      order.orderId.toString().includes(searchQuery.toLowerCase()) ||
      order.orderHash.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8">
      <AdminHeader
        title="Pedidos"
        description="Gestiona todos los pedidos del sistema"
      />

      {/* Barra de búsqueda y filtros */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <MagnifyingGlassIcon size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por ID o Hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setStatusFilter('QUEUED')}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              statusFilter === 'QUEUED'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            En Cola
          </button>
          <button
            onClick={() => setStatusFilter('PREPARING')}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              statusFilter === 'PREPARING'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Preparando
          </button>
          <button
            onClick={() => setStatusFilter('ON_THE_WAY')}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              statusFilter === 'ON_THE_WAY'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            En Camino
          </button>
          <button
            onClick={() => setStatusFilter('DELIVERED')}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              statusFilter === 'DELIVERED'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Entregados
          </button>
          <button
            onClick={() => setStatusFilter('CANCELLED')}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              statusFilter === 'CANCELLED'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancelados
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="py-8 flex justify-center items-center text-center">
          <SpinnerGapIcon className="w-10 h-10 animate-spin text-gray-500" />
        </div>
      )}

      {!isLoading && (
        <PedidosTable
          pedidos={filteredOrders}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Modal de detalles */}
      <AdminOrderDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        order={selectedOrder}
        onOrderUpdated={handleOrderUpdated}
      />
    </div>
  );
};

export default AdminPedidosPage;
