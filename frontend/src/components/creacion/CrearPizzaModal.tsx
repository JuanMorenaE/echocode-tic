'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CategoryAccordion } from './CategoryAccordion';
import { Ingrediente } from '@/types/ingrediente.types';
import { StarIcon } from '@/components/icons';

interface CrearPizzaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrearPizzaModal = ({ isOpen, onClose }: CrearPizzaModalProps) => {
  const [nombre, setNombre] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedMasa, setSelectedMasa] = useState<number[]>([]);
  const [selectedSalsa, setSelectedSalsa] = useState<number[]>([]);
  const [selectedQueso, setSelectedQueso] = useState<number[]>([]);
  const [selectedToppings, setSelectedToppings] = useState<number[]>([]);

  // TODO: Obtener ingredientes del backend
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([
    { id: 1, tipoProducto: 'PIZZA', nombre: 'Masa Napolitana', categoria: 'MASA', precio: 100, cantidad: 1 },
    { id: 2, tipoProducto: 'PIZZA', nombre: 'Masa Integral', categoria: 'MASA', precio: 120, cantidad: 1 },
    { id: 3, tipoProducto: 'PIZZA', nombre: 'Masa Sin Gluten', categoria: 'MASA', precio: 150, cantidad: 1 },
    { id: 4, tipoProducto: 'PIZZA', nombre: 'Salsa de Tomate', categoria: 'SALSA', precio: 50, cantidad: 1 },
    { id: 5, tipoProducto: 'PIZZA', nombre: 'Salsa Pomodoro', categoria: 'SALSA', precio: 60, cantidad: 1 },
    { id: 6, tipoProducto: 'PIZZA', nombre: 'Salsa Blanca', categoria: 'SALSA', precio: 70, cantidad: 1 },
    { id: 7, tipoProducto: 'PIZZA', nombre: 'Mozzarella', categoria: 'QUESO', precio: 80, cantidad: 1 },
    { id: 8, tipoProducto: 'PIZZA', nombre: 'Roquefort', categoria: 'QUESO', precio: 100, cantidad: 1 },
    { id: 9, tipoProducto: 'PIZZA', nombre: 'Parmesano', categoria: 'QUESO', precio: 90, cantidad: 1 },
    { id: 10, tipoProducto: 'PIZZA', nombre: 'Pepperoni', categoria: 'TOPPING', precio: 120, cantidad: 1 },
    { id: 11, tipoProducto: 'PIZZA', nombre: 'Jamón', categoria: 'TOPPING', precio: 100, cantidad: 1 },
    { id: 12, tipoProducto: 'PIZZA', nombre: 'Champiñones', categoria: 'TOPPING', precio: 80, cantidad: 1 },
    { id: 13, tipoProducto: 'PIZZA', nombre: 'Aceitunas', categoria: 'TOPPING', precio: 70, cantidad: 1 },
    { id: 14, tipoProducto: 'PIZZA', nombre: 'Pimientos', categoria: 'TOPPING', precio: 60, cantidad: 1 },
    { id: 15, tipoProducto: 'PIZZA', nombre: 'Cebolla', categoria: 'TOPPING', precio: 50, cantidad: 1 },
  ]);

  const masas = ingredientes.filter(i => i.categoria === 'MASA');
  const salsas = ingredientes.filter(i => i.categoria === 'SALSA');
  const quesos = ingredientes.filter(i => i.categoria === 'QUESO');
  const toppings = ingredientes.filter(i => i.categoria === 'TOPPING');

  const handleSelectMasa = (id: number) => {
    setSelectedMasa([id]); // Solo una
  };

  const handleSelectSalsa = (id: number) => {
    setSelectedSalsa([id]); // Solo una
  };

  const handleSelectQueso = (id: number) => {
    setSelectedQueso([id]); // Solo uno
  };

  const handleSelectTopping = (id: number) => {
    if (selectedToppings.includes(id)) {
      setSelectedToppings(selectedToppings.filter(i => i !== id));
    } else {
      setSelectedToppings([...selectedToppings, id]);
    }
  };

  const calcularPrecio = () => {
    const allSelected = [...selectedMasa, ...selectedSalsa, ...selectedQueso, ...selectedToppings];
    return allSelected.reduce((total, id) => {
      const ingrediente = ingredientes.find(i => i.id === id);
      return total + (ingrediente?.precio || 0);
    }, 0);
  };

  const handleAgregar = () => {
    // TODO: Agregar al carrito
    console.log('Pizza creada:', {
      nombre,
      masa: selectedMasa,
      salsa: selectedSalsa,
      queso: selectedQueso,
      toppings: selectedToppings,
      precio: calcularPrecio(),
    });
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

      {/* Content scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        <CategoryAccordion
          title="Masa"
          ingredientes={masas}
          selectedIds={selectedMasa}
          onSelect={handleSelectMasa}
          selectionType="single"
          required
        />

        <CategoryAccordion
          title="Salsa"
          ingredientes={salsas}
          selectedIds={selectedSalsa}
          onSelect={handleSelectSalsa}
          selectionType="single"
          required
        />

        <CategoryAccordion
          title="Queso"
          ingredientes={quesos}
          selectedIds={selectedQueso}
          onSelect={handleSelectQueso}
          selectionType="single"
          required
        />

        <CategoryAccordion
          title="Toppings"
          ingredientes={toppings}
          selectedIds={selectedToppings}
          onSelect={handleSelectTopping}
          selectionType="multiple"
        />
      </div>

      {/* Footer fijo */}
      <div className="px-6 py-4 bg-white border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-gray-900">${calcularPrecio()}</span>
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
            disabled={selectedMasa.length === 0 || selectedSalsa.length === 0 || selectedQueso.length === 0}
          >
            Agregar al Carrito
          </Button>
        </div>
      </div>
    </Modal>
  );
};
