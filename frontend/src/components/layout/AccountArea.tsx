"use client";

import React, { useState, useEffect } from 'react';
import { XIcon } from '@/components/icons';
import useAuth from '@/hooks/useAuth';

import PerfilPanel from './account/PerfilPanel';
import MisPedidosPanel from './account/MisPedidosPanel';
import DireccionesPanel from './account/DireccionesPanel';
import TarjetasPanel from './account/TarjetasPanel';

const AccountArea: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<'perfil' | 'mis-pedidos' | 'direcciones' | 'tarjetas'>('perfil');
  const { state, logout, isLoading } = useAuth();

  useEffect(() => {
    const handleOpen = (e: any) => {
      setPanel(e.detail.panel);
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    window.addEventListener('openAccount', handleOpen as EventListener);
    window.addEventListener('closeAccount', handleClose as EventListener);

    return () => {
      window.removeEventListener('openAccount', handleOpen as EventListener);
      window.removeEventListener('closeAccount', handleClose as EventListener);
    };
  }, []);


  if (!open) return null;

  const closePanel = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent('closeAccount'));
  };

  // Mostrar loading si aún está cargando
  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 my-6 relative z-10">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
  <div className="bg-white shadow-md rounded-lg p-6 my-6 relative z-10 pr-12 md:pr-16">
      {/* Close button */}
      <button
        onClick={closePanel}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-20 bg-white rounded-full p-1"
        title="Cerrar"
        aria-label="Cerrar panel de cuenta"
      >
        <XIcon size={24} />
      </button>

      <div className="flex gap-6">
        <aside className="w-60 border-r pr-4">
          <ul className="space-y-2">
            <li>
              <button className={`w-full text-left px-3 py-2 rounded ${panel === 'perfil' ? 'bg-primary-50 text-primary-600 font-medium' : 'hover:bg-gray-50'}`} onClick={() => setPanel('perfil')}>
                Mi Perfil
              </button>
            </li>
            <li>
              <button className={`w-full text-left px-3 py-2 rounded ${panel === 'direcciones' ? 'bg-primary-50 text-primary-600 font-medium' : 'hover:bg-gray-50'}`} onClick={() => setPanel('direcciones')}>
                Mis Direcciones
              </button>
            </li>
            <li>
              <button className={`w-full text-left px-3 py-2 rounded ${panel === 'tarjetas' ? 'bg-primary-50 text-primary-600 font-medium' : 'hover:bg-gray-50'}`} onClick={() => setPanel('tarjetas')}>
                Mis Tarjetas
              </button>
            </li>
            <li className="pt-2 border-t border-gray-200">
              <button className={`w-full text-left px-3 py-2 rounded ${panel === 'mis-pedidos' ? 'bg-primary-50 text-primary-600 font-medium' : 'hover:bg-gray-50'}`} onClick={() => setPanel('mis-pedidos')}>
                Mis Pedidos
              </button>
            </li>
            <li className="pt-2 border-t border-gray-200">
              <button
                className="w-full text-left px-3 py-2 rounded hover:bg-red-50 hover:text-red-600 transition-colors"
                onClick={logout}
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </aside>

        <div className="flex-1">
          {panel === 'perfil' && <PerfilPanel />}
          {panel === 'mis-pedidos' && <MisPedidosPanel />}
          {panel === 'direcciones' && <DireccionesPanel />}
          {panel === 'tarjetas' && <TarjetasPanel />}
        </div>
      </div>
    </div>
  );
};

export default AccountArea;
