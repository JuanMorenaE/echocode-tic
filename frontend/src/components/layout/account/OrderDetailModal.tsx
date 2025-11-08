"use client";

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { OrderResponse, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types/order.types';
import orderApi from '@/services/api/orderApi';
import { useToast } from '@/context/ToastContext';
import {
  XIcon,
  ClipboardTextIcon,
  MapPinIcon,
  CreditCardIcon,
  CalendarIcon,
  PizzaIcon,
  HamburgerIcon,
  XCircleIcon,
} from '@/components/icons';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderResponse | null;
  onOrderCancelled?: () => void; // Callback para recargar la lista
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ isOpen, onClose, order, onOrderCancelled }) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const { success, error: showError } = useToast();

  if (!order) return null;

  const canBeCancelled = order.orderStatus === 'QUEUED' || order.orderStatus === 'PREPARING';

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      await orderApi.cancelOrder(order.orderId);
      success('Pedido cancelado exitosamente');
      setShowCancelConfirm(false);
      onClose();

      // Llamar al callback para recargar la lista
      if (onOrderCancelled) {
        onOrderCancelled();
      }
    } catch (err: any) {
      console.error('Error cancelando pedido:', err);
      showError(err.message || 'Error al cancelar el pedido');
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const totalItems = order.creations.length + order.products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title={`Pedido #${order.orderId}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Pedido #{order.orderId}
            </h2>
            <p className="text-sm text-gray-600">Hash: {order.orderHash.substring(0, 8)}...</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon size={24} />
          </button>
        </div>

        {/* Estado y Fecha */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <ClipboardTextIcon size={20} className="text-gray-600" />
              <span className="text-sm text-gray-600">Estado</span>
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${ORDER_STATUS_COLORS[order.orderStatus]}`}>
              {ORDER_STATUS_LABELS[order.orderStatus]}
            </span>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <CalendarIcon size={20} className="text-gray-600" />
              <span className="text-sm text-gray-600">Fecha</span>
            </div>
            <p className="text-sm font-medium text-gray-900">{formatDate(order.orderDate)}</p>
          </div>
        </div>

        {/* Creaciones */}
        {order.creations.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Creaciones Personalizadas</h3>
            <div className="space-y-3">
              {order.creations.map((creation) => (
                <div
                  key={creation.creationId}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      {creation.creationType === 'PIZZA' ? (
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <PizzaIcon size={24} weight="fill" className="text-primary-600" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <HamburgerIcon size={24} weight="fill" className="text-primary-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{creation.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {creation.ingredients.length} ingredientes
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {creation.ingredients.slice(0, 5).map((ing, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-white px-2 py-1 rounded border border-gray-200"
                          >
                            {ing.name}
                          </span>
                        ))}
                        {creation.ingredients.length > 5 && (
                          <span className="text-xs text-gray-500 px-2 py-1">
                            +{creation.ingredients.length - 5} más
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-gray-900 mt-2">
                        {formatPrice(creation.totalPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Productos */}
        {order.products.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Productos</h3>
            <div className="space-y-2">
              {order.products.map((product, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                      🍟
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.productName}</p>
                      <p className="text-xs text-gray-500">Cantidad: {product.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(product.price * product.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dirección de entrega */}
        {order.deliveryAddress && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <MapPinIcon size={20} className="text-gray-600" weight="fill" />
              <h3 className="font-semibold text-gray-900">Dirección de Entrega</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900">{order.deliveryAddress.alias}</p>
              <p className="text-sm text-gray-700 mt-1">
                {order.deliveryAddress.street} {order.deliveryAddress.number}
                {order.deliveryAddress.apartmentNumber && `, Apto ${order.deliveryAddress.apartmentNumber}`}
              </p>
              <p className="text-sm text-gray-600">
                {order.deliveryAddress.city}, CP {order.deliveryAddress.zipCode}
              </p>
              {order.deliveryAddress.additionalInfo && (
                <p className="text-xs text-gray-500 mt-2">{order.deliveryAddress.additionalInfo}</p>
              )}
            </div>
          </div>
        )}

        {/* Método de pago */}
        {order.paymentCard && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <CreditCardIcon size={20} className="text-gray-600" weight="fill" />
              <h3 className="font-semibold text-gray-900">Método de Pago</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900">{order.paymentCard.alias}</p>
              <p className="text-sm text-gray-700">{order.paymentCard.cardholderName}</p>
              <p className="text-sm text-gray-600 font-mono">
                •••• •••• •••• {order.paymentCard.last4Digits}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {order.paymentCard.cardType} - Vence: {order.paymentCard.expirationDate}
              </p>
            </div>
          </div>
        )}

        {/* Notas */}
        {order.notes && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Notas del Pedido</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">{order.notes}</p>
            </div>
          </div>
        )}

        {/* Total */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Subtotal ({totalItems} items)</span>
            <span className="text-gray-900">{formatPrice(order.total)}</span>
          </div>
          <div className="flex items-center justify-between text-xl font-bold">
            <span>Total</span>
            <span className="text-gray-900">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 mt-6">
          {canBeCancelled && (
            <button
              onClick={() => setShowCancelConfirm(true)}
              disabled={isCancelling}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <XCircleIcon size={20} />
              Cancelar Pedido
            </button>
          )}
          <button
            onClick={onClose}
            className={`${canBeCancelled ? 'flex-1' : 'w-full'} bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors`}
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Diálogo de confirmación */}
      <ConfirmDialog
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleCancelOrder}
        title="¿Cancelar pedido?"
        message={`¿Estás seguro de que deseas cancelar el pedido #${order.orderId}? Esta acción no se puede deshacer.`}
        confirmText={isCancelling ? "Cancelando..." : "Sí, cancelar"}
        cancelText="No, mantener pedido"
        type="danger"
      />
    </Modal>
  );
};

export default OrderDetailModal;
