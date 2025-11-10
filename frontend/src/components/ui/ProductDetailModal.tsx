'use client';

import { Modal } from './Modal';
import { Button } from './Button';
import { PizzaIcon, HamburgerIcon } from '@/components/icons';
import { Ingrediente } from '@/types/ingrediente.types';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  tipo: 'PIZZA' | 'HAMBURGUESA' | 'SIDE' | 'DRINK';
  descripcion?: string;
  precio: number;
  ingredientes?: Ingrediente[];
  onAddToCart: () => void;
}

export const ProductDetailModal = ({
  isOpen,
  onClose,
  name,
  tipo,
  descripcion,
  precio,
  ingredientes = [],
  onAddToCart
}: ProductDetailModalProps) => {
  const isCreacion = tipo === 'PIZZA' || tipo === 'HAMBURGUESA';

  // Agrupar ingredientes por categoría (solo para creaciones)
  const ingredientesPorCategoria = ingredientes.reduce((acc, ing) => {
    const categoria = ing.category;
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(ing);
    return acc;
  }, {} as Record<string, Ingrediente[]>);

  // Mapeo de categorías a nombres amigables
  const categoriaNombres: Record<string, string> = {
    // Pizza
    'DOUGH': 'Masa',
    'SAUCE': 'Salsa',
    'CHEESE': 'Queso',
    'TOPPING': 'Toppings',
    // Hamburguesa
    'BREAD': 'Pan',
    'MEAT': 'Carne',
    'SAUCE_BURGER': 'Aderezo',
    'VEGETABLE': 'Vegetales',
    'EXTRA': 'Extras'
  };

  const getTipoLabel = () => {
    switch(tipo) {
      case 'PIZZA': return 'Pizza Personalizada';
      case 'HAMBURGUESA': return 'Hamburguesa Personalizada';
      case 'SIDE': return 'Acompañamiento';
      case 'DRINK': return 'Bebida';
    }
  };

  const getIcon = () => {
    if (tipo === 'PIZZA') {
      return <PizzaIcon size={48} weight="fill" className="text-primary-600" />;
    } else if (tipo === 'HAMBURGUESA') {
      return <HamburgerIcon size={48} weight="fill" className="text-primary-600" />;
    } else if (tipo === 'SIDE') {
      return <span className="text-5xl">🍟</span>;
    } else {
      return <span className="text-5xl">🥤</span>;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle del Producto" size="lg">
      {/* Header con icono y nombre */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-200 to-primary-100 rounded-xl flex items-center justify-center">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
          <p className="text-gray-600">{getTipoLabel()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Precio {isCreacion ? 'Total' : ''}</p>
          <p className="text-3xl font-bold text-gray-800">${precio}</p>
        </div>
      </div>

      {/* Contenido específico según el tipo */}
      <div className="space-y-4 mb-6">
        {isCreacion && ingredientes.length > 0 ? (
          // Lista de ingredientes por categoría para creaciones
          Object.entries(ingredientesPorCategoria).map(([categoria, ings]) => (
            <div key={categoria} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                {categoriaNombres[categoria] || categoria}
              </h4>
              <div className="space-y-2">
                {ings.map((ing, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-gray-700">{ing.name}</span>
                    <span className="text-gray-600 font-medium">${ing.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          // Descripción para productos (sides y drinks)
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Descripción</h4>
            <p className="text-gray-700 leading-relaxed">
              {descripcion || 'No hay descripción disponible.'}
            </p>
          </div>
        )}
      </div>

      {/* Footer con botones */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          variant="ghost"
          onClick={onClose}
          className="flex-1 bg-white text-black hover:bg-gray-100 border border-gray-300"
        >
          Cerrar
        </Button>
        <Button
          onClick={() => {
            onAddToCart();
            onClose();
          }}
          className="flex-1"
        >
          Agregar al Carrito
        </Button>
      </div>
    </Modal>
  );
};
