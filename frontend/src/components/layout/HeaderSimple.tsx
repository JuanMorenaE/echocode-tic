'use client';

import Link from 'next/link';
import { ShoppingCartIcon } from '@/components/icons';
import UserMenu from './UserMenu';
import { useCartContext } from '@/context/CartContext';

export const HeaderSimple = () => {
  const { carrito } = useCartContext();

  const handleOpenCart = () => {
    window.dispatchEvent(new CustomEvent('openCart'));
  };

  return (
    <header className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden p-4">
      <div className='max-w-screen-xl w-full mx-auto flex flex-col'>
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className='flex items-center justify-between'>
          <Link href="/">
            <img
              src="/Logo1.png"
              alt="PizzUM & BurgUM"
              className="w-full max-w-[120px] cursor-pointer hover:opacity-90 transition-opacity"
          />
          </Link>

          {/* Iconos superiores */}
          <div className="flex gap-3 items-center">
            <UserMenu />
            <button
              onClick={handleOpenCart}
              className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            >
              <ShoppingCartIcon size={20} className="text-primary-600" />
              {carrito.cantidadTotal > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                  {carrito.cantidadTotal}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
