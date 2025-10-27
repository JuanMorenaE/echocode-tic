'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Ingrediente, CategoriaIngrediente, CATEGORIAS_PIZZA, CATEGORIAS_HAMBURGUESA } from '@/types/ingrediente.types';

interface IngredienteFormProps {
  ingrediente?: Ingrediente;
  onSubmit: (data: Partial<Ingrediente>) => void;
  onCancel: () => void;
}

export const IngredienteForm = ({ ingrediente, onSubmit, onCancel }: IngredienteFormProps) => {
  const [formData, setFormData] = useState({
    tipoProducto: ingrediente?.type || 'PIZZA',
    nombre: ingrediente?.name || '',
    categoria: ingrediente?.category || 'MASA',
    precio: ingrediente?.price?.toString() || '',
    cantidad: ingrediente?.quantity?.toString() || '1',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const tipoProductoOptions = [
    { value: 'PIZZA', label: 'Pizza' },
    { value: 'HAMBURGUESA', label: 'Hamburguesa' },
  ];

  // Actualizar categorías según el tipo de producto seleccionado
  const categoriasDisponibles = formData.tipoProducto === 'PIZZA'
    ? CATEGORIAS_PIZZA
    : CATEGORIAS_HAMBURGUESA;

  // Resetear categoría si cambia el tipo de producto
  useEffect(() => {
    if (formData.tipoProducto === 'PIZZA' && !CATEGORIAS_PIZZA.find(c => c.value === formData.categoria)) {
      setFormData(prev => ({ ...prev, categoria: 'MASA' }));
    } else if (formData.tipoProducto === 'BURGER' && !CATEGORIAS_HAMBURGUESA.find(c => c.value === formData.categoria)) {
      setFormData(prev => ({ ...prev, categoria: 'PAN' }));
    }
  }, [formData.tipoProducto]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.precio || Number(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    if (!formData.cantidad || Number(formData.cantidad) <= 0) {
      newErrors.cantidad = 'La cantidad debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: Conectar con backend
      const ingredienteData: Partial<Ingrediente> = {
        type: formData.tipoProducto as 'PIZZA' | 'BURGER',
        name: formData.nombre,
        category: formData.categoria as any,
        price: Number(formData.precio),
        quantity: Number(formData.cantidad),
        isEnabled: true,
      };

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
      onSubmit(ingredienteData);
    } catch (error) {
      setErrors({ submit: 'Error al guardar el ingrediente' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-h-[500px] h-full overflow-auto px-6">
      <Select
        label="Tipo de Producto"
        options={tipoProductoOptions}
        value={formData.tipoProducto}
        onChange={(e) => setFormData({ ...formData, tipoProducto: e.target.value as 'PIZZA' | 'BURGER' })}
        error={errors.tipoProducto}
      />

      <Input
        label="Nombre del Ingrediente"
        placeholder="Ej: Masa Napolitana"
        value={formData.nombre}
        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        error={errors.nombre}
      />

      <Select
        label="Categoría"
        options={categoriasDisponibles}
        value={formData.categoria}
        onChange={(e) => setFormData({ ...formData, categoria: e.target.value as CategoriaIngrediente })}
        error={errors.categoria}
      />

      <Input
        label="Cantidad"
        type="number"
        placeholder="1"
        value={formData.cantidad}
        onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
        error={errors.cantidad}
      />

      <Input
        label="Precio"
        type="number"
        placeholder="0"
        value={formData.precio}
        onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
        error={errors.precio}
      />

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.submit}
        </div>
      )}

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading} >
          {ingrediente ? 'Actualizar' : 'Crear'} Ingrediente
        </Button>
      </div>
    </form>
  );
};
