"use client";

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { AddressRequest } from '@/types/address.types';

interface DireccionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (direccion: AddressRequest) => Promise<void>;
  isSaving: boolean;
}

const DireccionModal: React.FC<DireccionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSaving,
}) => {
  const [formData, setFormData] = useState<Partial<AddressRequest>>({
    alias: '',
    street: '',
    number: '',
    apartmentNumber: '',
    city: '',
    zipCode: '',
    additionalInfo: '',
    isDefault: false,
  });

  const handleSubmit = async () => {
    if (!formData.alias || !formData.street || !formData.number || !formData.city || !formData.zipCode) {
      alert('Por favor completa los campos obligatorios (Alias, Calle, Número, Ciudad, Código Postal)');
      return;
    }

    const request: AddressRequest = {
      alias: formData.alias!,
      street: formData.street!,
      number: formData.number!,
      apartmentNumber: formData.apartmentNumber || '',
      city: formData.city!,
      zipCode: formData.zipCode!,
      additionalInfo: formData.additionalInfo || '',
      isDefault: formData.isDefault || false,
    };

    await onSubmit(request);

    // Resetear formulario
    setFormData({
      alias: '',
      street: '',
      number: '',
      apartmentNumber: '',
      city: '',
      zipCode: '',
      additionalInfo: '',
      isDefault: false,
    });
  };

  const handleClose = () => {
    // Resetear formulario al cerrar
    setFormData({
      alias: '',
      street: '',
      number: '',
      apartmentNumber: '',
      city: '',
      zipCode: '',
      additionalInfo: '',
      isDefault: false,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Agregar Dirección" size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Alias *"
            placeholder="Ej: Casa, Trabajo"
            value={formData.alias}
            onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
          />

          <Input
            label="Calle *"
            placeholder="Ej: Av. 18 de Julio"
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          />

          <Input
            label="Número *"
            placeholder="1234"
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
          />

          <Input
            label="Apartamento"
            placeholder="301"
            value={formData.apartmentNumber}
            onChange={(e) => setFormData({ ...formData, apartmentNumber: e.target.value })}
          />

          <Input
            label="Ciudad *"
            placeholder="Montevideo"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />

          <Input
            label="Código Postal *"
            placeholder="11200"
            value={formData.zipCode}
            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
          />

          <div className="md:col-span-2">
            <Input
              label="Información adicional"
              placeholder="Ej: Portón verde, Timbre 2"
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="ghost" onClick={handleClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} isLoading={isSaving}>
            Agregar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DireccionModal;
