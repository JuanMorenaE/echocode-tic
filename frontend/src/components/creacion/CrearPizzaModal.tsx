'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CategoryAccordion } from './CategoryAccordion';
import { CATEGORIAS_PIZZA, Ingrediente } from '@/types/ingrediente.types';
import { StarIcon } from '@/components/icons';
import { Category } from '@/types/category.types';
import { SpinnerGapIcon } from '@phosphor-icons/react';

interface CrearPizzaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrearPizzaModal = ({ isOpen, onClose }: CrearPizzaModalProps) => {
  const [nombre, setNombre] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    setTotalPrice(0)
  
    async function fetchData() {
      try {
        setLoading(true);

        const response = await fetch('http://localhost:8080/api/v1/ingredients/type', {
          headers: { "Content-Type": "application/json" },
          method: 'POST',
          body: JSON.stringify("PIZZA")
        });

        if (!response.ok) throw new Error('Error en la respuesta');
        const data: Ingrediente[] = await response.json();

        const grouped = data.reduce((accumulator, ingredient) => {
          if (!accumulator[ingredient.category]) 
            accumulator[ingredient.category] = [];

          accumulator[ingredient.category].push(ingredient);
          return accumulator;
        }, {} as Record<string, Ingrediente[]>);

        console.log(grouped)
        console.log(Object.entries(grouped))

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
  }, [isOpen]);

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

  const handleAgregar = () => {
    // TODO: Agregar al carrito
    // console.log('Pizza creada:', {
    //   nombre,
    //   masa: selectedMasa,
    //   salsa: selectedSalsa,
    //   queso: selectedQueso,
    //   toppings: selectedToppings,
    //   precio: calcularPrecio(),
    // });
    onClose();
  };

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
          onClick={() => setIsFavorite(!isFavorite)}
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
            disabled={!requiredCompleted()}
          >
            Agregar al Carrito
          </Button>
        </div>
      </div>
    </Modal>
  );
};
