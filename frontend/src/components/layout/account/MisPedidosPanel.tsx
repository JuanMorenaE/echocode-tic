"use client";

import React, { useState, useEffect } from 'react';
import orderApi from '@/services/api/orderApi';
import OrderDetailModal from './OrderDetailModal';
import { OrderResponse, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types/order.types';
import { ClockIcon, PackageIcon } from '@/components/icons';

const MisPedidosPanel: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await orderApi.getMyOrders();
      // Ordenar por fecha más reciente primero
      const sortedOrders = data.sort((a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      );
      setOrders(sortedOrders);
    } catch (err: any) {
      console.error('Error cargando pedidos:', err);
      setError(err.message || 'Error al cargar los pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderClick = (order: OrderResponse) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Hoy';
    if (diffInDays === 1) return 'Ayer';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;

    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const getTotalItems = (order: OrderResponse) => {
    return order.creations.length + order.products.reduce((sum, p) => sum + p.quantity, 0);
  };

  if (isLoading) {
    return (
      <div>
        <h3 className="text-2xl font-semibold mb-4">Mis Pedidos</h3>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h3 className="text-2xl font-semibold mb-4">Mis Pedidos</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-700">{error}</p>
          <button
            onClick={loadOrders}
            className="mt-3 text-red-600 hover:text-red-700 font-medium text-sm underline"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <h3 className="text-2xl font-semibold mb-4">Mis Pedidos</h3>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <PackageIcon size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 mb-2">No tienes pedidos aún</p>
          <p className="text-sm text-gray-500">¡Realiza tu primer pedido para ver tu historial aquí!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Mis Pedidos</h3>

      <div className="space-y-3">
        {orders.map((order) => (
          <button
            key={order.orderId}
            onClick={() => handleOrderClick(order)}
            className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-primary-300 text-left"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-semibold text-gray-900">Pedido #{order.orderId}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.orderStatus]}`}>
                    {ORDER_STATUS_LABELS[order.orderStatus]}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{getTotalItems(order)} items</span>
                  <span className="flex items-center gap-1">
                    <ClockIcon size={14} />
                    {formatDate(order.orderDate)}
                  </span>
                </div>

                {order.deliveryAddress && (
                  <p className="text-xs text-gray-500 mt-2">
                    📍 {order.deliveryAddress.street} {order.deliveryAddress.number}
                  </p>
                )}
              </div>

              <div className="text-right ml-4">
                <p className="font-bold text-gray-900 text-lg">{formatPrice(order.total)}</p>
                <p className="text-xs text-primary-600 mt-1">Ver detalles →</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Modal de detalles */}
      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onOrderCancelled={loadOrders}
      />
    </div>
  );
};

export default MisPedidosPanel;
