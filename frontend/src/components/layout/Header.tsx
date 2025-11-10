'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserIcon, ShoppingCartIcon, MagnifyingGlassIcon, PizzaIcon, HamburgerIcon } from '@/components/icons';
import UserMenu from './UserMenu';
import { CrearHamburguesaModal } from '@/components/creacion/CrearHamburguesaModal';
import { CrearPizzaModal } from '@/components/creacion/CrearPizzaModal';
import { useCartContext } from '@/context/CartContext';

export const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isHamburguesaModalOpen, setIsHamburguesaModalOpen] = useState(false);
  const [isPizzaModalOpen, setIsPizzaModalOpen] = useState(false);
  const { carrito } = useCartContext();

  const handleOpenCart = () => {
    window.dispatchEvent(new CustomEvent('openCart'));
  };

  return (
    <header className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white z-40 p-4">
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

        {/* Logo y tagline */}
        <div className="relative text-center px-5 py-8 z-20">
          <strong className="text-xl md:text-3xl opacity-95 font-bold italic">
            ¡Personalizalas tu mismo!
          </strong>

          {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto m-6">
          {/* Crear Hamburguesa */}
          <button
            id="hamburguesa"
            onClick={() => setIsHamburguesaModalOpen(true)}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-primary-500 relative"
          >
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <HamburgerIcon size={100} weight="fill" className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Crear Hamburguesa
              </h2>
              <p className="text-gray-600 text-center">
                Elige tu pan, carne, vegetales y más
              </p>
            </div>
          </button>

          {/* Crear Pizza */}
          <button
            id="pizza"
            onClick={() => setIsPizzaModalOpen(true)}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-primary-500"
          >
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <PizzaIcon size={100} weight="fill" className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Crear Pizza
              </h2>
              <p className="text-gray-600 text-center">
                Elige tu masa, salsa, queso y toppings
              </p>
            </div>
          </button>
        </div>
        
        {/* Modales */}
        <CrearHamburguesaModal isOpen={isHamburguesaModalOpen} onClose={() => setIsHamburguesaModalOpen(false)} />
        <CrearPizzaModal isOpen={isPizzaModalOpen} onClose={() => setIsPizzaModalOpen(false)} />

        </div>
      </div>
    </header>
  );
};