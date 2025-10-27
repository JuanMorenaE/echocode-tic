'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CategoryAccordion } from './CategoryAccordion';
import { Ingrediente } from '@/types/ingrediente.types';
import { StarIcon } from '@/components/icons';
import { Category } from '@/types/category.types';
import { SpinnerGapIcon, SpinnerIcon } from '@phosphor-icons/react';

interface CrearHamburguesaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrearHamburguesaModal = ({ isOpen, onClose }: CrearHamburguesaModalProps) => {
  const [nombre, setNombre] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedPan, setSelectedPan] = useState<number[]>([]);
  const [selectedCarne, setSelectedCarne] = useState<number[]>([]);
  const [selectedAderezos, setSelectedAderezos] = useState<number[]>([]);
  const [selectedVegetales, setSelectedVegetales] = useState<number[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!isOpen) return;
  
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:8080/api/v1/ingredients/type', {
          headers: {
            "Content-Type": "application/json"
          },
          method: 'POST',
          body: JSON.stringify("BURGER")
        });

        if (!response.ok) throw new Error('Error en la respuesta');
        const data: Ingrediente[] = await response.json();
        
        // setCategories(list_categories)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false)
      }
    }
  
    fetchData();
  }, [isOpen]);

  const [categories, setCategories] = useState<Category[]>([])

  // TODO: Obtener ingredientes del backend
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([])
  //   { id: 1, tipoProducto: 'HAMBURGUESA', nombre: 'Pan de Papa', categoria: 'PAN', precio: 60, cantidad: 1 },
  //   { id: 2, tipoProducto: 'HAMBURGUESA', nombre: 'Pan Integral', categoria: 'PAN', precio: 70, cantidad: 1 },
  //   { id: 3, tipoProducto: 'HAMBURGUESA', nombre: 'Pan Sin Gluten', categoria: 'PAN', precio: 90, cantidad: 1 },
  //   { id: 4, tipoProducto: 'HAMBURGUESA', nombre: 'Carne de Vaca', categoria: 'CARNE', precio: 200, cantidad: 1 },
  //   { id: 5, tipoProducto: 'HAMBURGUESA', nombre: 'Doble Carne de Vaca', categoria: 'CARNE', precio: 350, cantidad: 2 },
  //   { id: 6, tipoProducto: 'HAMBURGUESA', nombre: 'Triple Carne de Vaca', categoria: 'CARNE', precio: 450, cantidad: 3 },
  //   { id: 7, tipoProducto: 'HAMBURGUESA', nombre: 'Carne de Pollo', categoria: 'CARNE', precio: 180, cantidad: 1 },
  //   { id: 8, tipoProducto: 'HAMBURGUESA', nombre: 'Salsa BBQ', categoria: 'ADEREZO', precio: 40, cantidad: 1 },
  //   { id: 9, tipoProducto: 'HAMBURGUESA', nombre: 'Mayonesa', categoria: 'ADEREZO', precio: 30, cantidad: 1 },
  //   { id: 10, tipoProducto: 'HAMBURGUESA', nombre: 'Mostaza', categoria: 'ADEREZO', precio: 30, cantidad: 1 },
  //   { id: 11, tipoProducto: 'HAMBURGUESA', nombre: 'Ketchup', categoria: 'ADEREZO', precio: 30, cantidad: 1 },
  //   { id: 12, tipoProducto: 'HAMBURGUESA', nombre: 'Lechuga', categoria: 'VEGETAL', precio: 20, cantidad: 1 },
  //   { id: 13, tipoProducto: 'HAMBURGUESA', nombre: 'Tomate', categoria: 'VEGETAL', precio: 20, cantidad: 1 },
  //   { id: 14, tipoProducto: 'HAMBURGUESA', nombre: 'Cebolla', categoria: 'VEGETAL', precio: 15, cantidad: 1 },
  //   { id: 15, tipoProducto: 'HAMBURGUESA', nombre: 'Queso Cheddar', categoria: 'EXTRA', precio: 50, cantidad: 1 },
  //   { id: 16, tipoProducto: 'HAMBURGUESA', nombre: 'Bacon', categoria: 'EXTRA', precio: 60, cantidad: 1 },
  // ]);

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

  const handleAgregar = () => {
    // TODO: Agregar al carrito
    console.log('Hamburguesa creada:', {
      nombre,
      pan: selectedPan,
      carne: selectedCarne,
      aderezos: selectedAderezos,
      vegetales: selectedVegetales,
      extras: selectedExtras,
      precio: calcularPrecio(),
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Hamburguesa" size="lg">
      {/* Header con nombre y estrella */}
      <div className="px-6 pt-4 pb-2 flex items-center justify-between border-b border-gray-200">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Nombre de tu hamburguesa (opcional)"
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
            {categories.map(c => (
              <CategoryAccordion
                key={c.id}
                title={c.name}
                ingredientes={c.ingredients}
                category={c}
                onSelect={calcularPrecio}
                selectionType={c.multiple_select ? 'multiple' : 'single'}
                required
              />
            ))}
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
            disabled={selectedPan.length === 0 || selectedCarne.length === 0}
          >
            Agregar al Carrito
          </Button>
        </div>
      </div>
    </Modal>
  );
};
