"use client";

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { CardRequest, CardType } from '@/types/card.types';

const CARD_TYPES: { value: CardType; label: string }[] = [
  { value: 'VISA', label: 'Visa' },
  { value: 'MASTERCARD', label: 'Mastercard' },
  { value: 'AMEX', label: 'American Express' },
  { value: 'PREX', label: 'Prex' },
  { value: 'OCA', label: 'OCA' },
  { value: 'OTHER', label: 'Otra' },
];

interface TarjetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tarjeta: CardRequest) => Promise<void>;
  isSaving: boolean;
}

const TarjetaModal: React.FC<TarjetaModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSaving,
}) => {
  const [formData, setFormData] = useState<Partial<CardRequest & { cvv: string }>>({
    alias: '',
    cardholderName: '',
    cardNumber: '',
    expirationDate: '',
    cardType: 'VISA',
    cvv: '',
    isDefault: false,
  });

  const formatearNumero = (valor: string) => {
    const soloDigitos = valor.replace(/\D/g, '');
    const grupos = soloDigitos.match(/.{1,4}/g);
    return grupos ? grupos.join(' ') : soloDigitos;
  };

  const formatearVencimiento = (valor: string) => {
    const soloDigitos = valor.replace(/\D/g, '');
    if (soloDigitos.length >= 2) {
      return soloDigitos.slice(0, 2) + '/' + soloDigitos.slice(2, 4);
    }
    return soloDigitos;
  };

  const handleSubmit = async () => {
    if (!formData.alias || !formData.cardholderName || !formData.cardNumber || !formData.expirationDate || !formData.cvv || !formData.cardType) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Validar formato de número (solo dígitos, 15-16 caracteres)
    const soloDigitos = formData.cardNumber!.replace(/\s/g, '');
    if (soloDigitos.length < 15 || soloDigitos.length > 16) {
      alert('Número de tarjeta inválido');
      return;
    }

    // Validar formato de vencimiento (MM/YY)
    const expirationParts = formData.expirationDate!.split('/');
    if (expirationParts.length !== 2 || expirationParts[0].length !== 2 || expirationParts[1].length !== 2) {
      alert('Formato de vencimiento inválido. Usa MM/YY');
      return;
    }

    const request: CardRequest = {
      alias: formData.alias!,
      cardholderName: formData.cardholderName!,
      cardNumber: soloDigitos,
      expirationDate: formData.expirationDate!,
      cardType: formData.cardType!,
      isDefault: formData.isDefault || false,
    };

    await onSubmit(request);

    // Resetear formulario
    setFormData({
      alias: '',
      cardholderName: '',
      cardNumber: '',
      expirationDate: '',
      cardType: 'VISA',
      cvv: '',
      isDefault: false,
    });
  };

  const handleClose = () => {
    // Resetear formulario al cerrar
    setFormData({
      alias: '',
      cardholderName: '',
      cardNumber: '',
      expirationDate: '',
      cardType: 'VISA',
      cvv: '',
      isDefault: false,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Agregar Tarjeta" size="lg">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">Tus datos están seguros y encriptados</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Alias *"
              placeholder="Ej: Visa Personal"
              value={formData.alias}
              onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Titular *"
              placeholder="Nombre como aparece en la tarjeta"
              value={formData.cardholderName}
              onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Número de Tarjeta *"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={(e) => {
                const formateado = formatearNumero(e.target.value);
                setFormData({ ...formData, cardNumber: formateado });
              }}
              maxLength={19}
            />
          </div>

          <Select
            label="Tipo de Tarjeta *"
            value={formData.cardType}
            onChange={(e) => setFormData({ ...formData, cardType: e.target.value as CardType })}
            options={CARD_TYPES.map((type) => ({ value: type.value, label: type.label }))}
          />

          <Input
            label="Vencimiento *"
            placeholder="MM/YY"
            value={formData.expirationDate}
            onChange={(e) => {
              const formateado = formatearVencimiento(e.target.value);
              setFormData({ ...formData, expirationDate: formateado });
            }}
            maxLength={5}
          />

          <Input
            label="CVV *"
            type="password"
            placeholder="123"
            value={formData.cvv}
            onChange={(e) => {
              const valor = e.target.value.replace(/\D/g, '');
              setFormData({ ...formData, cvv: valor });
            }}
            maxLength={4}
          />
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

export default TarjetaModal;
