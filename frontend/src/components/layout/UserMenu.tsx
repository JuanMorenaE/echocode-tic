"use client";

import React, { useState, useRef, useEffect } from 'react';
import { UserIcon, UserCircleIcon, ShoppingBagIcon, HeartIcon, SignOutIcon, MapPinIcon, CreditCardIcon } from '@/components/icons';
import useAuth from '@/hooks/useAuth';

export const UserMenu: React.FC = () => {
  const { state, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const openPanel = (panel: 'perfil' | 'mis-pedidos' | 'favoritos' | 'direcciones' | 'tarjetas') => {
    window.dispatchEvent(new CustomEvent('openAccount', { detail: { panel } }));
    setOpen(false);
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (state?.user?.firstName && state?.user?.lastName) {
      return `${state.user.firstName[0]}${state.user.lastName[0]}`.toUpperCase();
    }
    if (state?.user?.email) {
      return state.user.email[0].toUpperCase();
    }
    return 'U';
  };

  // if (!state?.token) {
  //   return (
  //     <a
  //       href="/login"
  //       className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-200 cursor-pointer"
  //     >
  //       <UserIcon size={20} className="text-primary-600" />
  //     </a>
  //   );
  // }

  return (
    <div className="relative z-[60]" ref={ref}>
      {/* User Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-200 text-white font-bold text-sm ring-2 ring-white"
      >
        {getInitials()}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <>
          {/* Backdrop fade */}
          <div className="fixed inset-0 z-[55]" onClick={() => setOpen(false)} />

          {/* Menu */}
          <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-slideDown">
            {/* User Info Header */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg font-bold">
                  {getInitials()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    {state?.user?.firstName && state?.user?.lastName
                      ? `${state.user.firstName} ${state.user.lastName}`
                      : state?.user?.email || 'Usuario'}
                  </p>
                  {state?.user?.email && (
                    <p className="text-xs text-white text-opacity-90 truncate">
                      {state.user.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => openPanel('perfil')}
                className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors flex items-center gap-3 text-gray-700 hover:text-primary-600"
              >
                <UserCircleIcon size={20} className="text-gray-400" />
                <span className="font-medium">Mi Perfil</span>
              </button>

              <button
                onClick={() => openPanel('direcciones')}
                className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors flex items-center gap-3 text-gray-700 hover:text-primary-600"
              >
                <MapPinIcon size={20} className="text-gray-400" />
                <span className="font-medium">Mis Direcciones</span>
              </button>

              <button
                onClick={() => openPanel('tarjetas')}
                className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors flex items-center gap-3 text-gray-700 hover:text-primary-600"
              >
                <CreditCardIcon size={20} className="text-gray-400" />
                <span className="font-medium">Mis Tarjetas</span>
              </button>

              <div className="border-t border-gray-100 my-2" />

              <button
                onClick={() => openPanel('mis-pedidos')}
                className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors flex items-center gap-3 text-gray-700 hover:text-primary-600"
              >
                <ShoppingBagIcon size={20} className="text-gray-400" />
                <span className="font-medium">Mis Pedidos</span>
              </button>

              <button
                onClick={() => openPanel('favoritos')}
                className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors flex items-center gap-3 text-gray-700 hover:text-primary-600"
              >
                <HeartIcon size={20} className="text-gray-400" />
                <span className="font-medium">Favoritos</span>
              </button>

              <div className="border-t border-gray-100 my-2" />

              <button
                onClick={() => { logout(); }}
                className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600 hover:text-red-700"
              >
                <SignOutIcon size={20} />
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
