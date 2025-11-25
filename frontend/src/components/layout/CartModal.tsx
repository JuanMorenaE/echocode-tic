"use client";

import React, { useState, useEffect } from 'react';
import { useCartContext } from '@/context/CartContext';
import { XIcon, ShoppingCartIcon, TrashIcon, PizzaIcon, HamburgerIcon } from '@/components/icons';
import { useRouter } from 'next/navigation';

export const CartModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { carrito, removerItem, actualizarCantidad, vaciarCarrito } = useCartContext();
  const router = useRouter();

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen && !isClosing) {
      // Guardar la posición actual del scroll
      const scrollY = window.scrollY;

      // Bloquear scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurar scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';

      // Restaurar la posición del scroll
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // Cleanup al desmontar
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen, isClosing]);

  useEffect(() => {
    const handleOpenCart = () => {
      setIsOpen(true);
      setIsClosing(false);
    };

    const handleCloseCart = () => {
      handleClose();
    };

    window.addEventListener('openCart', handleOpenCart as EventListener);
    window.addEventListener('closeCart', handleCloseCart as EventListener);

    return () => {
      window.removeEventListener('openCart', handleOpenCart as EventListener);
      window.removeEventListener('closeCart', handleCloseCart as EventListener);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    // Esperar a que termine la animación antes de cerrar
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300); // Duración de la animación
  };

  const handleRealizarPedido = () => {
    handleClose();
    setTimeout(() => {
      router.push('/checkout');
    }, 300);
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  if (!isOpen && !isClosing) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[90] ${
          isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[100] flex flex-col ${
          isClosing ? 'animate-slideOutRight' : 'animate-slideInRight'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCartIcon size={28} weight="fill" />
            <div>
              <h2 className="text-2xl font-bold">Mi Carrito</h2>
              <p className="text-sm text-white text-opacity-90">
                {carrito.cantidadTotal} {carrito.cantidadTotal === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
          >
            <XIcon size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {carrito.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCartIcon size={80} className="text-gray-300 mb-4" weight="fill" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-600">
                Agrega productos para comenzar tu pedido
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {carrito.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {item.tipoItem === 'CREACION' ? (
                        item.creacion?.tipo === 'PIZZA' ? (
                          <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                            <PizzaIcon size={32} weight="fill" className="text-primary-600" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                            <HamburgerIcon size={32} weight="fill" className="text-primary-600" />
                          </div>
                        )
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-3xl">
                          {item.producto?.tipo === 'DRINK' ? '🥤' : '🍟'}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {item.tipoItem === 'CREACION'
                              ? item.creacion?.nombre
                              : item.producto?.nombre}
                          </h4>
                          {item.tipoItem === 'CREACION' && (
                            <p className="text-xs text-gray-500 mt-1">
                              {item.creacion?.ingredientes.length} ingredientes
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removerItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                        >
                          <TrashIcon size={18} />
                        </button>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                            className="w-7 h-7 bg-white border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors font-semibold text-gray-700"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-900">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                            className="w-7 h-7 bg-white border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors font-semibold text-gray-700"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-800">
                            {formatPrice(item.precioTotal)}
                          </p>
                          {item.cantidad > 1 && (
                            <p className="text-xs text-gray-500">
                              {formatPrice(item.precioUnitario)} c/u
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {carrito.items.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            {/* Total */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(carrito.precioTotal)}
              </span>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={vaciarCarrito}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Vaciar Carrito
                </button>
                <button
                  onClick={handleRealizarPedido}
                  className="flex-1 bg-primary-600 border border-gray-300 text-white py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Realizar Pedido
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartModal;
