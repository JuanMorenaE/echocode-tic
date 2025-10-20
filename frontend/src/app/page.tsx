'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import AccountArea from '@/components/layout/AccountArea';
import { Footer } from '@/components/layout/Footer';
import { FloatingCart } from '@/components/layout/FloatingCart';
import { ProductCard } from '@/components/ui/Card';
import { PizzaIcon, HamburgerIcon, HeartIcon } from '@/components/icons';
import { Producto } from '@/types/producto.types';
import useAuth from '@/hooks/useAuth';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'favoritos' | 'acompañamientos' | 'bebidas'>('favoritos');
  const [isAccountAreaOpen, setIsAccountAreaOpen] = useState(false);
  const { state } = useAuth();
  const isLoggedIn = !!state?.token;

  // TODO: Obtener productos del backend
  const acompañamientos: Producto[] = [
    { id: 1, tipo: 'ACOMPAÑAMIENTO', name: 'Papas Fritas', price: 150, description: 'Porción grande de papas fritas crujientes' },
    { id: 2, tipo: 'ACOMPAÑAMIENTO', name: 'Aros de Cebolla', price: 180, description: '8 aros de cebolla rebozados' },
    { id: 3, tipo: 'ACOMPAÑAMIENTO', name: 'Nuggets de Pollo', price: 200, description: '10 nuggets de pollo con salsa' },
  ];

  const bebidas: Producto[] = [
    { id: 4, tipo: 'BEBIDA', name: 'Coca Cola 500ml', price: 80, description: 'Bebida refrescante' },
    { id: 5, tipo: 'BEBIDA', name: 'Agua Mineral', price: 60, description: 'Agua mineral sin gas' },
    { id: 6, tipo: 'BEBIDA', name: 'Cerveza Artesanal', price: 150, description: 'Cerveza artesanal de la casa' },
    { id: 7, tipo: 'BEBIDA', name: 'Jugo Natural', price: 100, description: 'Jugo natural de naranja' },
  ];

  const favoritos: Producto[] = []; // TODO: Obtener favoritos del usuario

  // Detectar cuando se abre/cierra AccountArea
  useEffect(() => {
    const handleAccountOpen = () => {
      setIsAccountAreaOpen(true);
    };

    const handleAccountClose = () => {
      setIsAccountAreaOpen(false);
    };

    window.addEventListener('openAccount', handleAccountOpen as EventListener);
    window.addEventListener('closeAccount', handleAccountClose as EventListener);

    return () => {
      window.removeEventListener('openAccount', handleAccountOpen as EventListener);
      window.removeEventListener('closeAccount', handleAccountClose as EventListener);
    };
  }, []);

  // Detectar cambio de hash para cambiar pestaña
  useEffect(() => {
    const handleHashChange = () => {
      // Cerrar AccountArea cuando se navega
      window.dispatchEvent(new CustomEvent('closeAccount'));
      setIsAccountAreaOpen(false);

      const hash = window.location.hash.replace('#', '');
      // Normalizar el hash para manejar caracteres especiales
      if (hash === 'acompañamientos' || hash === 'acompa%C3%B1amientos') {
        setActiveTab('acompañamientos');
      } else if (hash === 'bebidas') {
        setActiveTab('bebidas');
      } else {
        setActiveTab('favoritos');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderContent = () => {
    if (activeTab === 'favoritos') {
      if (!isLoggedIn) {
        return (
          <div className="text-center py-20">
            <HeartIcon size={80} className="text-gray-300 mx-auto mb-6" weight="fill" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Inicia sesión para guardar tus favoritos
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tus pizzas y hamburguesas personalizadas y guárdalas como favoritos
            </p>
            <a
              href="/login"
              className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Iniciar Sesión
            </a>
          </div>
        );
      }

      if (favoritos.length === 0) {
        return (
          <div className="text-center py-20">
            <HeartIcon size={80} className="text-gray-300 mx-auto mb-6" weight="fill" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Comienza a crear!
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primera hamburguesa o pizza personalizada y guárdala como favorito
            </p>
          </div>
        );
      }

      return (
        <>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Mis Favoritos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoritos.map((item, index) => (
              <ProductCard
                key={item.id}
                name={item.name}
                price={item.price}
                description={item.description}
                icon={item.tipo === 'PIZZA' ?
                  <PizzaIcon size={80} weight="fill" className="text-primary-600" /> :
                  <HamburgerIcon size={80} weight="fill" className="text-primary-600" />
                }
                animationDelay={index * 100}
              />
            ))}
          </div>
        </>
      );
    }

    if (activeTab === 'acompañamientos') {
      return (
        <>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Acompañamientos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {acompañamientos.map((item, index) => (
              <ProductCard
                key={item.id}
                name={item.name}
                price={item.price}
                description={item.description}
                icon={<span className="text-6xl">🍟</span>}
                animationDelay={index * 100}
              />
            ))}
          </div>
        </>
      );
    }

    if (activeTab === 'bebidas') {
      return (
        <>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Bebidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bebidas.map((item, index) => (
              <ProductCard
                key={item.id}
                name={item.name}
                price={item.price}
                description={item.description}
                icon={<span className="text-6xl">🥤</span>}
                animationDelay={index * 100}
              />
            ))}
          </div>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />

      <div className="max-w-7xl mx-auto px-5 relative">
        <AccountArea />

        {/* Solo mostrar contenido del navbar si AccountArea NO está abierto */}
        {!isAccountAreaOpen && (
          <main className="py-10">
            {renderContent()}
          </main>
        )}
      </div>

      <Footer />
      <FloatingCart itemCount={0} />
    </div>
  );
}