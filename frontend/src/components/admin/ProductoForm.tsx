'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Producto, ProductType } from '@/types/producto.types';

interface ProductoFormProps {
  producto?: Producto;
  onSubmit: (data: Producto) => Promise<void>;
  onCancel: () => void;
}

export const ProductoForm = ({ producto, onSubmit, onCancel }: ProductoFormProps) => {
  const [formData, setFormData] = useState({
    name: producto?.name || '',
    price: producto?.price?.toString() || '',
    description: producto?.description || '',
    type: producto?.type || 'OTHER'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const tipoProductoOptions = [
    { value: 'ACOMPAÑAMIENTO', label: 'Acompañamiento' },
    { value: 'BEBIDA', label: 'Bebida' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
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
      const productoData : Producto = {
        id: producto?.id ?? -1,
        type: formData.type,
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        isAvailable: true,
      };

      await onSubmit(productoData);
    } catch (error) {
      setErrors({ submit: 'Error al guardar el producto' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-h-[500px] h-full overflow-auto px-6">
      <Select
        label="Tipo de Producto"
        options={tipoProductoOptions}
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value as ProductType })}
        error={errors.tipo}
      />

      <Input
        label="Nombre del Producto"
        placeholder="Ej: Pizza Napolitana"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.nombre}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción / Ingredientes
        </label>
        <textarea
          placeholder="Describe el producto y sus ingredientes..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.descripcion ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.descripcion && (
          <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
        )}
      </div>

      <Input
        label="Precio"
        type="number"
        placeholder="0"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        error={errors.precio}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagen del Producto
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="imagen-upload"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // TODO: Implementar subida de imagen
                console.log('Imagen seleccionada:', file.name);
              }
            }}
          />
          <label htmlFor="imagen-upload" className="cursor-pointer">
            <div className="text-gray-400 mb-2">
              <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              Click para subir imagen o arrastra aquí
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG hasta 5MB
            </p>
          </label>
        </div>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.submit}
        </div>
      )}

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {producto ? 'Actualizar' : 'Crear'} Producto
        </Button>
      </div>
    </form>
  );
};