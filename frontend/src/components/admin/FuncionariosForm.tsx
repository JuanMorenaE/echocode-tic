'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Funcionario } from '@/types/employes.types';

export interface FuncionariosFormProps {
  funcionario?: Funcionario;
  onSubmit: (data: Funcionario) => Promise<void>;
  onCancel: () => void;
}

export const FuncionariosForm = ({ funcionario, onSubmit, onCancel }: FuncionariosFormProps) => {
  const [formData, setFormData] = useState({
    firstName: funcionario?.firstName || '',
    lastName: funcionario?.lastName || '',
    document: funcionario?.document || '',
    email: funcionario?.email || '',
    phoneNumber: funcionario?.phoneNumber || '',
    password: funcionario?.password || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.document.trim()) {
      newErrors.document = 'El documento es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'El teléfono es requerido';
    }

    // Solo validar password si es un nuevo funcionario
    if (!funcionario && !formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!funcionario && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const funcionarioData: Funcionario = {
        id: funcionario?.id ?? 0,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        document: formData.document,
        phoneNumber: formData.phoneNumber,
        address: null,
      };

      await onSubmit(funcionarioData);
    } catch (error) {
      setErrors({ submit: 'Error al guardar el funcionario' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nombre"
          placeholder="Ej: Juan"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          error={errors.firstName}
        />

        <Input
          label="Apellido"
          placeholder="Ej: Pérez"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          error={errors.lastName}
        />
      </div>

      <Input
        label="Cédula"
        placeholder="12345678"
        value={formData.document}
        onChange={(e) => setFormData({ ...formData, document: e.target.value })}
        error={errors.document}
      />

      <Input
        label="Email"
        type="email"
        placeholder="juan.perez@example.com"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
      />

      <Input
        label="Teléfono"
        type="tel"
        placeholder="091234567"
        value={formData.phoneNumber}
        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
        error={errors.phoneNumber}
      />

      {!funcionario && (
        <Input
          label="Contraseña"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
        />
      )}

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
