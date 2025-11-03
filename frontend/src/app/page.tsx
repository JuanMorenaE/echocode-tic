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
import { useToast } from '@/context/ToastContext';
import { SpinnerGapIcon } from '@phosphor-icons/react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'favoritos' | 'acompañamientos' | 'bebidas'>('favoritos');
  const [isAccountAreaOpen, setIsAccountAreaOpen] = useState(false);
  const { state } = useAuth();
  const isLoggedIn = !!state?.token;

  const { success, error } = useToast();
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [sides, setSides] = useState<Producto[]>([]);
  const [drinks, setDrinks] = useState<Producto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try{
        setLoadingProducts(true)
        const response = await fetch('http://localhost:8080/api/v1/products');
        const data: Producto[] = await response.json()
  
        console.log(data)
        setSides(data.filter(item => item.type === 'SIDE'))
        setDrinks(data.filter(item => item.type === 'DRINK'))
      }catch(ex){
        console.error(ex)
        error("Ocurrio un error inesperado, contacta a un administrador.")
      }finally{
        setLoadingProducts(false)
      }
    }

    fetchData()
  }, [])

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
                icon={item.type === 'DRINK' ?
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
          {loadingProducts ? (
            <div className="flex justify-center items-center py-10">
              <SpinnerGapIcon className="w-10 h-10 animate-spin text-gray-500" />
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Acompañamientos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sides.map((item, index) => (
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
          )
        }
        </>
      );
    }

    if (activeTab === 'bebidas') {
      return (
        <>
        {loadingProducts ? (
            <div className="flex justify-center items-center py-10">
              <SpinnerGapIcon className="w-10 h-10 animate-spin text-gray-500" />
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Bebidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {drinks.map((item, index) => (
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
          )
        }
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