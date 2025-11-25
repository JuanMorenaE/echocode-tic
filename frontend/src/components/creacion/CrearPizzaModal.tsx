'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CategoryAccordion } from './CategoryAccordion';
import { CATEGORIAS_PIZZA, Ingrediente } from '@/types/ingrediente.types';
import { StarIcon } from '@/components/icons';
import { Category } from '@/types/category.types';
import { SpinnerGapIcon } from '@phosphor-icons/react';
import useCart from '@/hooks/useCart';
import useAuth from '@/hooks/useAuth';
import type { CreacionCarrito } from '@/types/carrito.types';
import { useToast } from '@/context/ToastContext';
import api from '@/lib/axios/axiosConfig';
import { AuthModal } from '@/components/auth/AuthModal';

interface CrearPizzaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrearPizzaModal = ({ isOpen, onClose }: CrearPizzaModalProps) => {
  const [nombre, setNombre] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const { agregarCreacion } = useCart();
  const { success, error: showError } = useToast();
  const { state } = useAuth();
  const isLoggedIn = !!state?.token;

  useEffect(() => {
    if (!isOpen) return;

    // Si no está logueado, mostrar modal de autenticación
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    setTotalPrice(0)

    async function fetchData() {
      try {
        setLoading(true);

        const resp = await api.post<Ingrediente[]>('/v1/ingredients/type', "PIZZA");
        const data = resp.data;

        const grouped = data.reduce((accumulator, ingredient) => {
          if (!accumulator[ingredient.category]) 
            accumulator[ingredient.category] = [];

          accumulator[ingredient.category].push(ingredient);
          return accumulator;
        }, {} as Record<string, Ingrediente[]>);

        const list_categories: Category[] = Object.entries(grouped).map(([category, ingredients], index) => {
          const category_item = CATEGORIAS_PIZZA.find(x => x.value === category);

          return {
            id: index,
            name: category_item?.label ?? "",
            type: "PIZZA",
            ingredients: ingredients.sort((a, b) => a.name.localeCompare(b.name)),
            selected_ingredients: [],
            multiple_select: category_item?.multiple_select ?? false,
            required: category_item?.required ?? false,
            order: category_item?.order ?? -1,
          };
        });

        list_categories.sort((a, b) => a.order - b.order)
        
        setCategories(list_categories)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false)
      }
    }
  
    fetchData();
  }, [isOpen, isLoggedIn]);

  const calcularPrecio = () => {
    let total = 0

    categories.forEach(c => {
      c.selected_ingredients.forEach(selectedId => {
        let selected = c.ingredients.find(i => i.id == selectedId)
        total += selected?.price ?? 0
      })
    })

    setTotalPrice(total)
  };

  const requiredCompleted = () => {
    if(categories.length == 0)
      return false

    const required_categories = categories.filter(c => c.required);
    return required_categories.every(c => c.selected_ingredients.length > 0);
  }

  // Manejar el click en el botón de favorito
  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAgregar = async () => {
    setSaving(true);
    try {
      // Obtener todos los ingredientes seleccionados
      const ingredientesSeleccionados: Ingrediente[] = [];

      categories.forEach(category => {
        category.selected_ingredients.forEach(selectedId => {
          const ingrediente = category.ingredients.find(i => i.id === selectedId);
          if (ingrediente) {
            ingredientesSeleccionados.push(ingrediente);
          }
        });
      });

      // Validar que haya ingredientes
      if (ingredientesSeleccionados.length === 0) {
        showError('Selecciona al menos un ingrediente antes de guardar la creación.');
        setSaving(false);
        return;
      }

      // Crear la creación para el carrito
      const creacion: CreacionCarrito = {
        tipo: 'PIZZA',
        nombre: nombre.trim() || 'Mi Pizza Personalizada',
        ingredientes: ingredientesSeleccionados,
        esFavorito: isFavorite,
      };

      // Agregar al carrito (CartContext se encarga de guardar en backend si está logueado)
      agregarCreacion(creacion);

      // Mostrar toast de confirmación
      success(
        isFavorite
          ? '¡Pizza agregada al carrito y a favoritos!'
          : '¡Pizza agregada al carrito!'
      );

      // Resetear el formulario
      setNombre('');
      setIsFavorite(false);
      setCategories(prevCategories =>
        prevCategories.map(cat => ({ ...cat, selected_ingredients: [] }))
      );
      setTotalPrice(0);

      onClose();
    } catch (error) {
      console.error('Error al agregar pizza:', error);
      showError('Ocurrió un error al agregar la pizza');
    } finally {
      setSaving(false);
    }
  };

  // Si no está logueado, mostrar AuthModal
  if (!isLoggedIn) {
    return (
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          onClose(); // Cerrar también el modal principal
        }}
        onSuccess={() => {
          setShowAuthModal(false);
          // El useEffect se encargará de cargar los datos cuando isLoggedIn cambie
        }}
        defaultTab="login"
      />
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Pizza" size="lg">
      {/* Header con nombre y estrella */}
      <div className="px-6 pt-4 pb-2 flex items-center justify-between border-b border-gray-200">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Nombre de tu pizza (opcional)"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full text-2xl font-bold text-gray-900 placeholder-gray-400 border-none focus:outline-none focus:ring-0 p-0"
          />
        </div>
        <button
          onClick={handleFavoriteToggle}
          className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <StarIcon
            size={32}
            weight={isFavorite ? 'fill' : 'regular'}
            className={isFavorite ? 'text-yellow-500' : 'text-gray-400'}
          />
        </button>
      </div>

      {
        loading && (
          <div className='py-8 flex justify-center items-center text-center'>
            <SpinnerGapIcon className='w-10 h-10 animate-spin text-gray-500'/>
          </div>
        )
      }

      {/* Content scrollable */
        !loading && categories.length > 0 && (
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {
              categories.map(category => (
                <CategoryAccordion
                  key={category.id}
                  title={category.name}
                  ingredientes={category.ingredients}
                  category={category}
                  onSelect={calcularPrecio}
                  selectionType={category.multiple_select ? 'multiple' : 'single'}
                  required={category.required}
                />
              ))
            }
          </div>
        )
      }

      {
        !loading && categories.length == 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay ingredientes registrados.</p>
          </div>
        )
      }

      {/* Footer fijo */}
      <div className="px-6 py-4 bg-white border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-gray-900">${totalPrice}</span>
        </div>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 bg-white text-black hover:bg-gray-100 border border-gray-300 transition-colors"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAgregar}
            className="flex-1"
            disabled={!requiredCompleted() || saving}
          >
            {saving ? 'Guardando...' : 'Agregar al Carrito'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
