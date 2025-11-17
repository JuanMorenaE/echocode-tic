"use client";

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import {
  OrderResponse,
  OrderStatus,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS
} from '@/types/order.types';
import { Ingrediente, CategoriaIngrediente } from '@/types/ingrediente.types';
import orderApi from '@/services/api/orderApi';
import { useToast } from '@/context/ToastContext';
import {
  ClipboardTextIcon,
  MapPinIcon,
  CreditCardIcon,
  CalendarIcon,
  PizzaIcon,
  HamburgerIcon,
  UserIcon,
} from '@/components/icons';

interface AdminOrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderResponse | null;
  onOrderUpdated?: () => void; // Callback para recargar la lista
}

const AdminOrderDetailModal: React.FC<AdminOrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
  onOrderUpdated
}) => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order?.orderStatus || 'QUEUED');
  const [isUpdating, setIsUpdating] = useState(false);
  const { success, error: showError } = useToast();

  React.useEffect(() => {
    if (order) {
      setCurrentStatus(order.orderStatus);
    }
  }, [order]);

  if (!order) return null;

  const handleUpdateStatus = async () => {
    if (currentStatus === order.orderStatus) {
      showError('El estado no ha cambiado');
      return;
    }

    // Validación adicional en el frontend
    if (order.orderStatus === 'CANCELLED') {
      showError('No se puede actualizar el estado de un pedido cancelado');
      return;
    }

    if (order.orderStatus === 'DELIVERED') {
      showError('No se puede actualizar el estado de un pedido ya entregado');
      return;
    }

    setIsUpdating(true);
    try {
      await orderApi.updateStatus(order.orderId, currentStatus);
      success(`Estado actualizado a: ${ORDER_STATUS_LABELS[currentStatus]}`);

      // Llamar al callback para recargar la lista
      if (onOrderUpdated) {
        onOrderUpdated();
      }

      onClose();
    } catch (err: any) {
      console.error('Error actualizando estado:', err);
      showError(err.message || 'Error al actualizar el estado');
    } finally {
      setIsUpdating(false);
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

  // Función para agrupar ingredientes por categoría
  const groupIngredientsByCategory = (ingredients: Ingrediente[]) => {
    // Orden para Pizza: Tamaño → Masa → Salsa → Queso → Toppings
    const pizzaOrder: CategoriaIngrediente[] = ['TAMAÑO', 'MASA', 'SALSA', 'QUESO', 'TOPPING'];
    // Orden para Hamburguesa: Pan → Carne → Toppings → Aderezos
    const burgerOrder: CategoriaIngrediente[] = ['PAN', 'CARNE', 'TOPPING', 'ADEREZO'];

    const categoryLabels: Record<CategoriaIngrediente, string> = {
      'TAMAÑO': 'Tamaño',
      'MASA': 'Masa',
      'SALSA': 'Salsa',
      'QUESO': 'Queso',
      'TOPPING': 'Toppings',
      'PAN': 'Pan',
      'CARNE': 'Carne',
      'ADEREZO': 'Aderezos'
    };

    // Agrupar por categoría
    const grouped = ingredients.reduce((acc, ing) => {
      const category = ing.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(ing);
      return acc;
    }, {} as Record<CategoriaIngrediente, Ingrediente[]>);

    // Determinar si es pizza o hamburguesa basándose en las categorías presentes
    const isPizza = grouped['MASA'] || grouped['SALSA'] || grouped['QUESO'] || grouped['TAMAÑO'];
    const categoryOrder = isPizza ? pizzaOrder : burgerOrder;

    // Ordenar según el orden definido
    return categoryOrder
      .filter(cat => grouped[cat] && grouped[cat].length > 0)
      .map(cat => ({
        category: cat,
        label: categoryLabels[cat] || cat,
        ingredients: grouped[cat]
      }));
  };

  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: 'QUEUED', label: ORDER_STATUS_LABELS.QUEUED },
    { value: 'PREPARING', label: ORDER_STATUS_LABELS.PREPARING },
    { value: 'ON_THE_WAY', label: ORDER_STATUS_LABELS.ON_THE_WAY },
    { value: 'DELIVERED', label: ORDER_STATUS_LABELS.DELIVERED },
    { value: 'CANCELLED', label: ORDER_STATUS_LABELS.CANCELLED },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={`Pedido #${order.orderId}`}>
      <div className="p-6">
        {/* Header con ID del pedido */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Pedido #{order.orderId}
            </h2>
            <p className="text-sm text-gray-600">Hash: {order.orderHash}</p>
          </div>
        </div>

        {/* Estado actual y selector de nuevo estado */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardTextIcon size={20} className="text-gray-600" />
              <span className="text-sm text-gray-600 font-semibold">Estado Actual</span>
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

        {/* Cambiar estado */}
        {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED' ? (
          <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Cambiar Estado del Pedido
            </label>
            <div className="flex gap-3">
              <Select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as OrderStatus)}
                className="flex-1"
                options={statusOptions}
              />
              <Button
                onClick={handleUpdateStatus}
                isLoading={isUpdating}
                disabled={currentStatus === order.orderStatus}
                variant="primary"
              >
                Actualizar
              </Button>
            </div>
            {currentStatus !== order.orderStatus && (
              <p className="text-xs text-gray-600 mt-2">
                Se cambiará de <strong>{ORDER_STATUS_LABELS[order.orderStatus]}</strong> a <strong>{ORDER_STATUS_LABELS[currentStatus]}</strong>
              </p>
            )}
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
            <p className="text-sm text-gray-700 font-medium">
              {order.orderStatus === 'CANCELLED'
                ? '⚠️ Este pedido ha sido cancelado y no puede ser modificado.'
                : '✅ Este pedido ya ha sido entregado y no puede ser modificado.'}
            </p>
          </div>
        )}

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
                      <p className="text-xs text-gray-500">Cantidad: {creation.quantity}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {creation.ingredients.length} ingredientes
                      </p>

                      {/* Ingredientes agrupados por categoría */}
                      <div className="mt-3 space-y-2">
                        {groupIngredientsByCategory(creation.ingredients).map((group) => (
                          <div key={group.category}>
                            <p className="text-xs font-semibold text-gray-700 mb-1">
                              {group.label}:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {group.ingredients.map((ing, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-white px-2 py-1 rounded border border-gray-200"
                                >
                                  {ing.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <p className="text-sm font-bold text-gray-900 mt-3">
                        {formatPrice(creation.totalPrice * creation.quantity)}
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
                    {product?.productType === 'DRINK' ? '🥤' : '🍟'}
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

        {/* Botón cerrar */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AdminOrderDetailModal;
