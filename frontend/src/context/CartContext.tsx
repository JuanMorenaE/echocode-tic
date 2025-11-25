"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import creationsApi, { CreationRequestDTO } from '@/services/api/creationsApi';
import type { Carrito, ItemCarrito, CreacionCarrito, ProductoCarrito } from '@/types/carrito.types';

type CartContextType = {
  carrito: Carrito;
  agregarCreacion: (creacion: CreacionCarrito) => void;
  agregarProducto: (producto: ProductoCarrito, cantidad?: number) => void;
  removerItem: (itemId: string) => void;
  actualizarCantidad: (itemId: string, cantidad: number) => void;
  vaciarCarrito: () => void;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'burgum-pizzum-carrito';

const carritoVacio: Carrito = {
  items: [],
  cantidadTotal: 0,
  precioTotal: 0,
};

// Función para obtener la key del carrito específica del usuario
const getCartKey = (): string | null => {
  if (typeof window === 'undefined') return null;
  const email = localStorage.getItem('email');
  return email ? `${CART_STORAGE_KEY}-${email}` : null;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [carrito, setCarrito] = useState<Carrito>(carritoVacio);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Cargar carrito del localStorage al iniciar y cuando cambie el usuario
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const email = localStorage.getItem('email');
        const cartKey = getCartKey();

        // Si cambió el usuario, limpiar carrito primero
        if (email !== currentUser) {
          setCurrentUser(email);
          if (!email) {
            // Si se cerró sesión, limpiar carrito
            setCarrito(carritoVacio);
          } else if (cartKey) {
            // Si hay un nuevo usuario, cargar su carrito
            const savedCart = localStorage.getItem(cartKey);
            if (savedCart) {
              const parsedCart = JSON.parse(savedCart);
              setCarrito(parsedCart);
            } else {
              setCarrito(carritoVacio);
            }
          }
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [currentUser]);

  // Escuchar cambios en el localStorage (cuando se cierra sesión)
  useEffect(() => {
    const handleStorageChange = () => {
      const email = localStorage.getItem('email');
      if (!email && currentUser) {
        // Se cerró sesión, limpiar carrito
        setCarrito(carritoVacio);
        setCurrentUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentUser]);

  // Guardar carrito en localStorage cada vez que cambie (solo si hay usuario logueado)
  useEffect(() => {
    if (!isLoading && typeof window !== 'undefined') {
      try {
        const cartKey = getCartKey();
        if (cartKey) {
          localStorage.setItem(cartKey, JSON.stringify(carrito));
        }
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [carrito, isLoading]);

  // Función para calcular totales
  const calcularTotales = (items: ItemCarrito[]): { cantidadTotal: number; precioTotal: number } => {
    const cantidadTotal = items.reduce((sum, item) => sum + item.cantidad, 0);
    const precioTotal = items.reduce((sum, item) => sum + item.precioTotal, 0);
    return { cantidadTotal, precioTotal };
  };

  // Agregar creación personalizada al carrito
  const agregarCreacion = async (creacion: CreacionCarrito) => {
    const precioUnitario = creacion.ingredientes.reduce((sum, ing) => sum + ing.price, 0);

    // Guardar la creación en el backend PRIMERO si es nueva (no tiene id)
    let creacionConId = creacion;
    if (typeof window !== 'undefined' && !creacion.id) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const creationRequest: CreationRequestDTO = {
            name: creacion.nombre,
            creationType: creacion.tipo === 'PIZZA' ? 'PIZZA' : 'BURGER',
            isFavourite: !!creacion.esFavorito,
            ingredientIds: creacion.ingredientes.map(i => i.id),
          };

          // Guardar en backend y obtener el ID
          const response = await creationsApi.createCreation(creationRequest);
          creacionConId = {
            ...creacion,
            id: response.creationId, // Ahora la creación tiene ID del backend
          };

          // Si se guardó como favorito, disparar evento para recargar favoritos
          if (creacion.esFavorito) {
            window.dispatchEvent(new CustomEvent('reloadFavorites'));
          }
        } catch (err) {
          console.error('No se pudo guardar la creación al backend:', err);
          // Continuar agregando al carrito aunque falle el backend
        }
      } else {
        console.warn('agregarCreacion llamado sin token - esto no debería pasar porque los modales requieren login');
      }
    }

    const nuevoItem: ItemCarrito = {
      id: `creacion-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      tipoItem: 'CREACION',
      creacion: creacionConId, // Usar la creación con ID
      cantidad: 1,
      precioUnitario,
      precioTotal: precioUnitario,
    };

    const nuevosItems = [...carrito.items, nuevoItem];
    const totales = calcularTotales(nuevosItems);

    setCarrito({
      items: nuevosItems,
      ...totales,
    });
  };

  // Agregar producto al carrito
  const agregarProducto = (producto: ProductoCarrito, cantidad: number = 1) => {
    // Buscar si el producto ya existe en el carrito
    const itemExistenteIndex = carrito.items.findIndex(
      (item) => item.tipoItem === 'PRODUCTO' && item.producto?.id === producto.id
    );

    let nuevosItems: ItemCarrito[];

    if (itemExistenteIndex !== -1) {
      // Si existe, incrementar cantidad
      nuevosItems = carrito.items.map((item, index) => {
        if (index === itemExistenteIndex) {
          const nuevaCantidad = item.cantidad + cantidad;
          return {
            ...item,
            cantidad: nuevaCantidad,
            precioTotal: item.precioUnitario * nuevaCantidad,
          };
        }
        return item;
      });
    } else {
      // Si no existe, agregar nuevo item
      const nuevoItem: ItemCarrito = {
        id: `producto-${producto.id}-${Date.now()}`,
        tipoItem: 'PRODUCTO',
        producto,
        cantidad,
        precioUnitario: producto.precio,
        precioTotal: producto.precio * cantidad,
      };
      nuevosItems = [...carrito.items, nuevoItem];
    }

    const totales = calcularTotales(nuevosItems);

    setCarrito({
      items: nuevosItems,
      ...totales,
    });
  };

  // Remover item del carrito
  const removerItem = (itemId: string) => {
    const nuevosItems = carrito.items.filter((item) => item.id !== itemId);
    const totales = calcularTotales(nuevosItems);

    setCarrito({
      items: nuevosItems,
      ...totales,
    });
  };

  // Actualizar cantidad de un item
  const actualizarCantidad = (itemId: string, cantidad: number) => {
    if (cantidad <= 0) {
      removerItem(itemId);
      return;
    }

    const nuevosItems = carrito.items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          cantidad,
          precioTotal: item.precioUnitario * cantidad,
        };
      }
      return item;
    });

    const totales = calcularTotales(nuevosItems);

    setCarrito({
      items: nuevosItems,
      ...totales,
    });
  };

  // Vaciar carrito
  const vaciarCarrito = () => {
    setCarrito(carritoVacio);
  };

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarCreacion,
        agregarProducto,
        removerItem,
        actualizarCantidad,
        vaciarCarrito,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be used within CartProvider');
  return ctx;
};

export default CartContext;
