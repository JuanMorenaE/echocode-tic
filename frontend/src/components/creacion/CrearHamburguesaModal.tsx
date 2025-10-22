'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CategoryAccordion } from './CategoryAccordion';
import { Ingrediente } from '@/types/ingrediente.types';
import { StarIcon } from '@/components/icons';
import { Category } from '@/types/category.types';

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

  useEffect(() => {
    if (!isOpen) return;
  
    console.log("Modal abierto, fetch de datos");
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:8080/api/v1/categories');
        if (!response.ok) throw new Error('Error en la respuesta');
        console.log(response)
        const data = await response.json();

        console.log(data)

        const category: Category = {
          id: data[0].categoryId,
          name: data[0].categoryName,
          type: data[0].ingredientType,
          ingredients: data[0].ingredients.map((i : any) => ({
            id: i.ingredientId,
            nombre: i.ingredientName,
            tipoProducto: i.ingredientType,
            precio: i.price,
            cantidad: 1,
            disponible: i.enabled,
          }))
        }

        setCategories([...categories, category])

        console.log(category)
      } catch (error) {
        console.error(error);
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

  // const panes = ingredientes.filter(i => i.categoria === 'PAN');
  // const carnes = ingredientes.filter(i => i.categoria === 'CARNE');
  // const aderezos = ingredientes.filter(i => i.categoria === 'ADEREZO');
  // const vegetales = ingredientes.filter(i => i.categoria === 'VEGETAL');
  // const extras = ingredientes.filter(i => i.categoria === 'EXTRA');

  const handleSelectPan = (id: number) => {
    setSelectedPan([id]); // Solo uno
  };

  const handleSelectCarne = (id: number) => {
    setSelectedCarne([id]); // Solo una
  };

  const handleSelectAderezo = (id: number) => {
    if (selectedAderezos.includes(id)) {
      setSelectedAderezos(selectedAderezos.filter(i => i !== id));
    } else {
      setSelectedAderezos([...selectedAderezos, id]);
    }
  };

  const handleSelectVegetal = (id: number) => {
    if (selectedVegetales.includes(id)) {
      setSelectedVegetales(selectedVegetales.filter(i => i !== id));
    } else {
      setSelectedVegetales([...selectedVegetales, id]);
    }
  };

  const handleSelectExtra = (id: number) => {
    if (selectedExtras.includes(id)) {
      setSelectedExtras(selectedExtras.filter(i => i !== id));
    } else {
      setSelectedExtras([...selectedExtras, id]);
    }
  };

  const calcularPrecio = () => {
    const allSelected = [...selectedPan, ...selectedCarne, ...selectedAderezos, ...selectedVegetales, ...selectedExtras];
    return allSelected.reduce((total, id) => {
      const ingrediente = ingredientes.find(i => i.id === id);
      return total + (ingrediente?.precio || 0);
    }, 0);
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

      {/* Content scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {categories.map(c => (
          <CategoryAccordion
            key={c.id}
            title={c.name}
            ingredientes={c.ingredients}
            selectedIds={selectedPan}
            onSelect={handleSelectPan}
            selectionType="single"
            required
          />
        ))}
        {/* <CategoryAccordion
          title="Pan"
          ingredientes={panes}
          selectedIds={selectedPan}
          onSelect={handleSelectPan}
          selectionType="single"
          required
        />

        <CategoryAccordion
          title="Carne"
          ingredientes={carnes}
          selectedIds={selectedCarne}
          onSelect={handleSelectCarne}
          selectionType="single"
          required
        />

        <CategoryAccordion
          title="Aderezos"
          ingredientes={aderezos}
          selectedIds={selectedAderezos}
          onSelect={handleSelectAderezo}
          selectionType="multiple"
        />

        <CategoryAccordion
          title="Vegetales"
          ingredientes={vegetales}
          selectedIds={selectedVegetales}
          onSelect={handleSelectVegetal}
          selectionType="multiple"
        />

        <CategoryAccordion
          title="Extras"
          ingredientes={extras}
          selectedIds={selectedExtras}
          onSelect={handleSelectExtra}
          selectionType="multiple"
        /> */}
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
            disabled={selectedPan.length === 0 || selectedCarne.length === 0}
          >
            Agregar al Carrito
          </Button>
        </div>
      </div>
    </Modal>
  );
};
