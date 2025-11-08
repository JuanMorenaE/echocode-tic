'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { HeaderSimple } from '@/components/layout/HeaderSimple';
import { Navbar } from '@/components/layout/Navbar';
import AccountArea from '@/components/layout/AccountArea';
import { Footer } from '@/components/layout/Footer';
import { FloatingCart } from '@/components/layout/FloatingCart';
import { ProductCard } from '@/components/ui/Card';
import { ProductDetailModal } from '@/components/ui/ProductDetailModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PizzaIcon, HamburgerIcon, HeartIcon } from '@/components/icons';
import { Producto } from '@/types/producto.types';
import useAuth from '@/hooks/useAuth';
import useCart from '@/hooks/useCart';
import type { ProductoCarrito, CreacionCarrito } from '@/types/carrito.types';
import { useToast } from '@/context/ToastContext';
import creationsApi, { CreationResponseDTO } from '@/services/api/creationsApi';
import { Ingrediente } from '@/types/ingrediente.types';
import api from '@/lib/axios/axiosConfig';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'favoritos' | 'acompañamientos' | 'bebidas'>('favoritos');
  const [isAccountAreaOpen, setIsAccountAreaOpen] = useState(false);
  const [favoritos, setFavoritos] = useState<CreacionCarrito[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [acompañamientos, setAcompañamientos] = useState<Producto[]>([]);
  const [bebidas, setBebidas] = useState<Producto[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    name: string;
    tipo: 'PIZZA' | 'HAMBURGUESA' | 'SIDE' | 'DRINK';
    descripcion?: string;
    precio: number;
    ingredientes?: Ingrediente[];
  } | null>(null);
  const [favoritoToDelete, setFavoritoToDelete] = useState<CreacionCarrito | null>(null);
  const { state } = useAuth();
  const { agregarProducto, agregarCreacion } = useCart();
  const { success, error: showError } = useToast();
  const isLoggedIn = !!state?.token;

  // Cargar productos (acompañamientos y bebidas) desde el backend
  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await api.get<Producto[]>('/v1/products');
        const products = response.data;

        // Filtrar por tipo
        const sides = products.filter(p => p.type === 'SIDE' && p.available);
        const drinks = products.filter(p => p.type === 'DRINK' && p.available);

        setAcompañamientos(sides);
        setBebidas(drinks);
      } catch (error) {
        console.error('Error cargando productos:', error);
        showError('Error al cargar productos');
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  // Función para cargar favoritos (reutilizable)
  const loadFavorites = async () => {
    if (!isLoggedIn) {
      setFavoritos([]);
      setLoadingFavorites(false);
      return;
    }

    setLoadingFavorites(true);
    try {
      const favoritesData = await creationsApi.getFavorites();

      // Convertir CreationResponseDTO[] a CreacionCarrito[]
      const favoritosConvertidos: CreacionCarrito[] = favoritesData.map((fav: CreationResponseDTO) => ({
        id: fav.creationId, // Incluir el ID para poder eliminar
        tipo: fav.creationType === 'PIZZA' ? 'PIZZA' : 'HAMBURGUESA',
        nombre: fav.name,
        ingredientes: fav.ingredients as Ingrediente[],
        esFavorito: true,
      }));

      setFavoritos(favoritosConvertidos);
    } catch (error) {
      console.error('Error cargando favoritos:', error);
      // Silenciar errores de autenticación (401, 403)
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { status?: number } };
        // Solo mostrar error si es un error real del servidor (500+) o problemas de red
        if (err.response?.status && err.response.status >= 500) {
          showError('Error del servidor al cargar favoritos. Intenta más tarde.');
        } else if (!err.response?.status) {
          // Error de red
          showError('Error de conexión. Verifica tu internet.');
        }
        // Errores 401, 403, 404 se ignoran silenciosamente
      }
      // Limpiar favoritos en caso de error
      setFavoritos([]);
    } finally {
      setLoadingFavorites(false);
    }
  };

  // Cargar favoritos cuando el usuario esté logueado
  useEffect(() => {
    loadFavorites();
  }, [isLoggedIn]);

  // Escuchar evento personalizado para recargar favoritos
  useEffect(() => {
    const handleReloadFavorites = () => {
      if (isLoggedIn) {
        loadFavorites();
      }
    };

    window.addEventListener('reloadFavorites', handleReloadFavorites as EventListener);

    return () => {
      window.removeEventListener('reloadFavorites', handleReloadFavorites as EventListener);
    };
  }, [isLoggedIn]);

  const handleAgregarFavoritoAlCarrito = (favorito: CreacionCarrito) => {
    agregarCreacion(favorito);
    success(`¡${favorito.nombre} agregado al carrito!`);
  };

  const handleAgregarAlCarrito = (producto: Producto) => {
    const productoCarrito: ProductoCarrito = {
      id: producto.id,
      nombre: producto.name,
      tipo: producto.type as 'SIDE' | 'DRINK',
      precio: producto.price,
      descripcion: producto.description,
    };
    agregarProducto(productoCarrito, 1);
    success(`¡${producto.name} agregado al carrito!`);
  };

  const handleRemoveFavorite = (favorito: CreacionCarrito) => {
    if (!favorito.id) return;
    setFavoritoToDelete(favorito);
  };

  const confirmRemoveFavorite = async () => {
    if (!favoritoToDelete?.id) return;

    try {
      await creationsApi.deleteCreation(favoritoToDelete.id);
      setFavoritos(favoritos.filter(f => f.id !== favoritoToDelete.id));
      success(`"${favoritoToDelete.nombre}" eliminado de favoritos`);
    } catch (error) {
      console.error('Error eliminando favorito:', error);
      showError('Error al eliminar de favoritos');
    }
  };

  const handleShowFavoriteDetail = (favorito: CreacionCarrito) => {
    const precioTotal = favorito.ingredientes.reduce((sum, ing) => sum + ing.price, 0);
    setSelectedProduct({
      name: favorito.nombre,
      tipo: favorito.tipo,
      precio: precioTotal,
      ingredientes: favorito.ingredientes,
    });
  };

  const handleShowProductDetail = (producto: Producto) => {
    setSelectedProduct({
      name: producto.name,
      tipo: producto.type as 'SIDE' | 'DRINK',
      descripcion: producto.description,
      precio: producto.price,
    });
  };

  const handleAddSelectedToCart = () => {
    if (!selectedProduct) return;

    if (selectedProduct.tipo === 'SIDE' || selectedProduct.tipo === 'DRINK') {
      // Es un producto
      const producto = selectedProduct.tipo === 'SIDE'
        ? acompañamientos.find(p => p.name === selectedProduct.name)
        : bebidas.find(p => p.name === selectedProduct.name);

      if (producto) {
        handleAgregarAlCarrito(producto);
      }
    } else {
      // Es una creación/favorito
      const favorito = favoritos.find(f => f.nombre === selectedProduct.name);
      if (favorito) {
        handleAgregarFavoritoAlCarrito(favorito);
      }
    }
  };

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

      if (loadingFavorites) {
        return (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando favoritos...</p>
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
            {favoritos.map((favorito, index) => {
              // Calcular precio total
              const precioTotal = favorito.ingredientes.reduce((sum, ing) => sum + ing.price, 0);

              return (
                <ProductCard
                  key={favorito.id || index}
                  name={favorito.nombre}
                  price={precioTotal}
                  description={`${favorito.ingredientes.length} ingredientes seleccionados`}
                  icon={favorito.tipo === 'PIZZA' ?
                    <PizzaIcon size={80} weight="fill" className="text-primary-600" /> :
                    <HamburgerIcon size={80} weight="fill" className="text-primary-600" />
                  }
                  animationDelay={index * 100}
                  isFavorite={true}
                  onFavoriteToggle={() => handleRemoveFavorite(favorito)}
                  onCardClick={() => handleShowFavoriteDetail(favorito)}
                  onAddToCart={() => handleAgregarFavoritoAlCarrito(favorito)}
                />
              );
            })}
          </div>
        </>
      );
    }

    if (activeTab === 'acompañamientos') {
      if (loadingProducts) {
        return (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando acompañamientos...</p>
          </div>
        );
      }

      return (
        <>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Acompañamientos</h2>
          {acompañamientos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">No hay acompañamientos disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {acompañamientos.map((item, index) => (
                <ProductCard
                  key={item.id}
                  name={item.name}
                  price={item.price}
                  description={item.description}
                  icon={<span className="text-6xl">🍟</span>}
                  animationDelay={index * 100}
                  onCardClick={() => handleShowProductDetail(item)}
                  onAddToCart={() => handleAgregarAlCarrito(item)}
                />
              ))}
            </div>
          )}
        </>
      );
    }

    if (activeTab === 'bebidas') {
      if (loadingProducts) {
        return (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando bebidas...</p>
          </div>
        );
      }

      return (
        <>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Bebidas</h2>
          {bebidas.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">No hay bebidas disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bebidas.map((item, index) => (
                <ProductCard
                  key={item.id}
                  name={item.name}
                  price={item.price}
                  description={item.description}
                  icon={<span className="text-6xl">🥤</span>}
                  animationDelay={index * 100}
                  onCardClick={() => handleShowProductDetail(item)}
                  onAddToCart={() => handleAgregarAlCarrito(item)}
                />
              ))}
            </div>
          )}
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isAccountAreaOpen ? <HeaderSimple /> : <Header />}
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
      <FloatingCart />

      {/* Modal de detalle de producto */}
      {selectedProduct && (
        <ProductDetailModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          name={selectedProduct.name}
          tipo={selectedProduct.tipo}
          descripcion={selectedProduct.descripcion}
          precio={selectedProduct.precio}
          ingredientes={selectedProduct.ingredientes}
          onAddToCart={handleAddSelectedToCart}
        />
      )}

      {/* Modal de confirmación para eliminar favorito */}
      <ConfirmDialog
        isOpen={!!favoritoToDelete}
        onClose={() => setFavoritoToDelete(null)}
        onConfirm={confirmRemoveFavorite}
        title="Eliminar de Favoritos"
        message={`¿Estás seguro que quieres eliminar "${favoritoToDelete?.nombre}" de tus favoritos?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}