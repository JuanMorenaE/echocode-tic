'use client';

import React, { JSX, useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { Funcionario } from '@/types/employes.types';

export interface FuncionariosFormProps {
  funcionario?: Funcionario;
  onSubmit: (data: Funcionario) => Promise<void>;
  onCancel: () => void;
}

export const FuncionariosForm = ({ funcionario, onSubmit, onCancel }: FuncionariosFormProps) => {
  const [formData, setFormData] = useState({
    name: funcionario?.firstName || '',
    document: funcionario?.document?.toString() || '',
    phoneNumber: funcionario?.phoneNumber || '',
    address: funcionario?.address || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  /*const tipoProductoOptions = [
    { value: 'SIDE', label: 'Acompañamiento' },
    { value: 'DRINK', label: 'Bebida' },
  ];**/

  useEffect(() => {
      console.log(formData)
    }, [])
  
    const validateForm = () => {
      const newErrors: Record<string, string> = {};
  
      if (!formData.name.trim()) {
        newErrors.nombre = 'El nombre es requerido';
      }
  
      if (!formData.document.trim()) {
        newErrors.documento = 'El documento es requerido';
      }
  
      if (!formData.phoneNumber.trim()) {
        newErrors.telefono = 'El teléfono es requerido';
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
        const funcionarioData : Funcionario = {
          id: funcionario?.id ?? -1,
          firstName: formData.name,
          lastName: funcionario?.lastName || '',
          email: funcionario?.email || '',
          password: funcionario?.password || '',
          document: formData.document,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        };
  
        await onSubmit(funcionarioData);
      } catch (error) {
        setErrors({ submit: 'Error al guardar el funcionario' });
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-5 max-h-[500px] h-full overflow-auto px-6">
  
        <Input
          label="Nombre del Funcionario"
          placeholder="Ej: Juan Pérez"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.nombre}
        /> 
  
    {/*     <div>
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
        </div> */}
  
        <Input
          label="Cédula"
          type="number"
          placeholder="0"
          value={formData.document}
          onChange={(e) => setFormData({ ...formData, document: e.target.value })}
          error={errors.documento}
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
            {funcionario ? 'Actualizar' : 'Crear'} Funcionario
          </Button>
        </div>
      </form>
    );
  };

/*export default function FuncionariosForm({
  funcionario,
  onSubmit,
  onCancel,
}: FuncionariosFormProps): JSX.Element {
  const [form, setForm] = useState<Funcionario>(funcionario ?? {} as Funcionario);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.firstName ?? ''}
        onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
        placeholder="Nombre completo"
      />
       <input
        value={[form.document ?? '']}
        onChange={e => setForm(f => ({ ...f, document: e.target.value }))}
        placeholder="Cédula"
      />
       <input
        value={[form.email ?? '']}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        placeholder="Email"
      />
       <input
        value={[form.phoneNumber ?? '']}
        onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
        placeholder="Número de teléfono"
      />
       <input
        value={[form.address ?? '']}
        onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
        placeholder="Domicilio"
      />
      
      <div style={{ display: 'flex', gap: '50px' }}>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};


/**export const FuncionariosForm = ({ funcionario, onSubmit, onCancel }: FuncionariosFormProps) => {
  const [formData, setFormData] = useState({
    Nombre_completo: funcionario?.full_name || '',
    tipo: funcionario?.type || 'ADMINISTRADOR',
    fecha_ingreso: funcionario?.date_of_entry || '',
    imagen: '',
  })};/** */

  

