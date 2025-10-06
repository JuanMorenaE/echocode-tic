'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserIcon, ShoppingCartIcon, MagnifyingGlassIcon } from '@/components/icons';

export const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');

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
          <div className="flex gap-3">
            <Link href="/login">
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <UserIcon size={20} className="text-primary-600" />
              </button>
            </Link>
            <Link href="/carrito">
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <ShoppingCartIcon size={20} className="text-primary-600" />
              </button>
            </Link>
          </div>
        </div>

        {/* Logo y tagline */}
        <div className="relative text-center px-5 py-8">
          <p className="text-xl md:text-2xl opacity-95 mb-8">
            ¡Las mejores pizzas y hamburguesas de la ciudad!
          </p>

          {/* Barra de búsqueda */}
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
              <MagnifyingGlassIcon size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar tu favorita..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-5 py-4 rounded-full text-gray-800 text-base shadow-lg outline-none"
            />
          </div>
        </div>
      </div>
    </header>
  );
};