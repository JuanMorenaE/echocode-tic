"use client";

import { ShoppingCartIcon } from '@/components/icons';
import { useCartContext } from '@/context/CartContext';

export const FloatingCart = () => {
  const { carrito } = useCartContext();

  const handleOpenCart = () => {
    window.dispatchEvent(new CustomEvent('openCart'));
  };

  return (
    <button
      onClick={handleOpenCart}
      className="fixed bottom-8 right-8 w-16 h-16 bg-primary-600 rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-200 flex items-center justify-center z-50"
    >
      <ShoppingCartIcon size={28} className="text-white" weight="fill" />
      {carrito.cantidadTotal > 0 && (
        <span className="absolute -top-2 -right-2 bg-white text-primary-600 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-md">
          {carrito.cantidadTotal}
        </span>
      )}
    </button>
  );
};