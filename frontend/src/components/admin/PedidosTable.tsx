'use client';

import { OrderResponse, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types/order.types';
import { EyeIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';

interface PedidosTableProps {
  pedidos: OrderResponse[];
  onViewDetails: (pedido: OrderResponse) => void;
}

export const PedidosTable = ({ pedidos, onViewDetails }: PedidosTableProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">ID</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Hash</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Fecha</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Estado</th>
              <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Items</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Total</th>
              <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pedidos.map((pedido) => {
              const totalItems = pedido.creations.length + pedido.products.reduce((sum, p) => sum + p.quantity, 0);

              return (
                <tr key={pedido.orderId} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-900">#{pedido.orderId}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm text-gray-600">
                      {pedido.orderHash.substring(0, 8)}...
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600">
                      {formatDate(pedido.orderDate)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ORDER_STATUS_COLORS[pedido.orderStatus]}`}>
                      {ORDER_STATUS_LABELS[pedido.orderStatus]}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="font-medium text-gray-900">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-semibold text-gray-900">
                    {formatPrice(pedido.total)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(pedido)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <EyeIcon size={18} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pedidos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay pedidos registrados</p>
        </div>
      )}
    </div>
  );
};
