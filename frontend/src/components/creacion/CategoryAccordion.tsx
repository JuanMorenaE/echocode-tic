'use client';

import { useState } from 'react';
import { CaretDownIcon } from '@/components/icons';
import { Ingrediente } from '@/types/ingrediente.types';
import { Category } from '@/types/category.types';

interface CategoryAccordionProps {
  title: string;
  ingredientes: Ingrediente[];
  category: Category,
  onSelect: () => void;
  selectionType: 'single' | 'multiple'; // single = radio, multiple = checkbox
  required?: boolean;
}

export const CategoryAccordion = ({
  title,
  ingredientes,
  onSelect,
  category,
  selectionType,
  required = false,
}: CategoryAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const isSelected = (id: number) => category.selected_ingredients.includes(id);

  const selectIngredient = (category: Category, ingredient: Ingrediente) => {
    if(category.multiple_select && !selected.includes(ingredient.ingredientId)){
      setSelected([...selected, ingredient.ingredientId])
      category.selected_ingredients.push(ingredient.ingredientId)
    }
    else if(!category.multiple_select){
      setSelected([ingredient.ingredientId])
      category.selected_ingredients = [ingredient.ingredientId]
    }

    onSelect()
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden" key={category.id}>
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {required && <span className="text-red-500 text-sm">*</span>}
          {category.selected_ingredients.length > 0 && (
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
              {category.selected_ingredients.length} seleccionado{category.selected_ingredients.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <CaretDownIcon
          size={20}
          className={`text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Content */}
      {isOpen && (
        <div className="p-4 bg-white space-y-2">
          {ingredientes.map((ingrediente: Ingrediente) => (
            <label
              key={ingrediente.ingredientId}
              className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected(ingrediente.ingredientId)
                  ? 'border-gray-400 bg-gray-100'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type={selectionType === 'single' ? 'radio' : 'checkbox'}
                  name={selectionType === 'single' ? `category-${title}` : undefined}
                  checked={selected.includes(ingrediente.ingredientId)}
                  onChange={() => selectIngredient(category, ingrediente)}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{ingrediente.nombre}</span>
                    {ingrediente.cantidad > 1 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        x{ingrediente.cantidad}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span className="font-semibold text-gray-900">${ingrediente.precio}</span>
            </label>
          ))}

          {ingredientes.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No hay ingredientes disponibles
            </p>
          )}
        </div>
      )}
    </div>
  );
};
