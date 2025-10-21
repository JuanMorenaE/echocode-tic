"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CreditCardIcon, PlusIcon, TrashIcon, CheckCircleIcon } from '@/components/icons';
import cardApi from '@/services/api/cardApi';
import type { Card, CardRequest, CardType } from '@/types/card.types';

const CARD_TYPES: { value: CardType; label: string }[] = [
  { value: 'VISA', label: 'Visa' },
  { value: 'MASTERCARD', label: 'Mastercard' },
  { value: 'AMEX', label: 'American Express' },
  { value: 'PREX', label: 'Prex' },
  { value: 'OCA', label: 'OCA' },
  { value: 'OTHER', label: 'Otra' },
];

const TarjetasPanel: React.FC = () => {
  const [tarjetas, setTarjetas] = useState<Card[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [nuevaTarjeta, setNuevaTarjeta] = useState<Partial<CardRequest & { cvv: string }>>({
    alias: '',
    cardholderName: '',
    cardNumber: '',
    expirationDate: '',
    cardType: 'VISA',
    cvv: '',
    isDefault: false,
  });

  // Cargar tarjetas al montar el componente
  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setIsLoading(true);
    try {
      const data = await cardApi.getAll();
      setTarjetas(data);
    } catch (error) {
      console.error('Error cargando tarjetas:', error);
      alert('Error al cargar las tarjetas');
    } finally {
      setIsLoading(false);
    }
  };


  const handleAgregarTarjeta = async () => {
    if (!nuevaTarjeta.alias || !nuevaTarjeta.cardholderName || !nuevaTarjeta.cardNumber || !nuevaTarjeta.expirationDate || !nuevaTarjeta.cvv || !nuevaTarjeta.cardType) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Validar formato de número (solo dígitos, 15-16 caracteres)
    const soloDigitos = nuevaTarjeta.cardNumber!.replace(/\s/g, '');
    if (soloDigitos.length < 15 || soloDigitos.length > 16) {
      alert('Número de tarjeta inválido');
      return;
    }

    // Validar formato de vencimiento (MM/YY)
    const expirationParts = nuevaTarjeta.expirationDate!.split('/');
    if (expirationParts.length !== 2 || expirationParts[0].length !== 2 || expirationParts[1].length !== 2) {
      alert('Formato de vencimiento inválido. Usa MM/YY');
      return;
    }

    setIsSaving(true);
    try {
      const request: CardRequest = {
        alias: nuevaTarjeta.alias!,
        cardholderName: nuevaTarjeta.cardholderName!,
        cardNumber: soloDigitos,
        expirationDate: nuevaTarjeta.expirationDate!,
        cardType: nuevaTarjeta.cardType!,
        isDefault: nuevaTarjeta.isDefault || false,
      };

      await cardApi.create(request);
      await loadCards(); // Recargar lista

      // Resetear formulario
      setNuevaTarjeta({
        alias: '',
        cardholderName: '',
        cardNumber: '',
        expirationDate: '',
        cardType: 'VISA',
        cvv: '',
        isDefault: false,
      });
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Error creando tarjeta:', error);
      alert('Error al guardar la tarjeta');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEliminarTarjeta = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta tarjeta?')) {
      return;
    }

    try {
      await cardApi.delete(id);
      await loadCards(); // Recargar lista
    } catch (error) {
      console.error('Error eliminando tarjeta:', error);
      alert('Error al eliminar la tarjeta');
    }
  };

  const handleMarcarPredeterminada = async (id: number) => {
    try {
      const tarjeta = tarjetas.find(t => t.id === id);
      if (!tarjeta) return;

      const request: CardRequest = {
        alias: tarjeta.alias,
        cardholderName: tarjeta.cardholderName,
        cardNumber: tarjeta.last4Digits, // Backend solo necesita esto para actualizar
        expirationDate: tarjeta.expirationDate,
        cardType: tarjeta.cardType,
        isDefault: true,
      };

      await cardApi.update(id, request);
      await loadCards(); // Recargar lista
    } catch (error) {
      console.error('Error marcando tarjeta como predeterminada:', error);
      alert('Error al actualizar la tarjeta');
    }
  };

  const obtenerIconoTarjeta = (tipo: CardType) => {
  const label = (() => {
    switch (tipo) {
      case 'VISA':
        return 'Visa';
      case 'MASTERCARD':
        return 'Mastercard';
      case 'AMEX':
        return 'Amex';
      case 'PREX':
        return 'Prex';
      case 'OCA':
        return 'OCA';
      default:
        return 'Otra';
    }
  })();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center gap-2">
        <CreditCardIcon size={28} className="text-gray-600" weight="regular" />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
    </div>
  );
};


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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-600">Cargando tarjetas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mis Tarjetas</h2>
        <Button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="flex items-center gap-2"
        >
          <PlusIcon size={20} />
          Nueva Tarjeta
        </Button>
      </div>

      {/* Formulario para nueva tarjeta */}
      {mostrarFormulario && (
        <div className="bg-gray-50 p-6 rounded-lg space-y-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Agregar Tarjeta</h3>
          <p className="text-sm text-gray-600">Tus datos están seguros y encriptados</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Alias *"
                placeholder="Ej: Visa Personal"
                value={nuevaTarjeta.alias}
                onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, alias: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Titular *"
                placeholder="Nombre como aparece en la tarjeta"
                value={nuevaTarjeta.cardholderName}
                onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, cardholderName: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Número de Tarjeta *"
                placeholder="1234 5678 9012 3456"
                value={nuevaTarjeta.cardNumber}
                onChange={(e) => {
                  const formateado = formatearNumero(e.target.value);
                  setNuevaTarjeta({ ...nuevaTarjeta, cardNumber: formateado });
                }}
                maxLength={19}
              />
            </div>

            <Select
              label="Tipo de Tarjeta *"
              value={nuevaTarjeta.cardType}
              onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, cardType: e.target.value as CardType })}
              options={CARD_TYPES.map((type) => ({ value: type.value, label: type.label }))}
            />

            <Input
              label="Vencimiento *"
              placeholder="MM/YY"
              value={nuevaTarjeta.expirationDate}
              onChange={(e) => {
                const formateado = formatearVencimiento(e.target.value);
                setNuevaTarjeta({ ...nuevaTarjeta, expirationDate: formateado });
              }}
              maxLength={5}
            />

            <Input
              label="CVV *"
              type="password"
              placeholder="123"
              value={nuevaTarjeta.cvv}
              onChange={(e) => {
                const valor = e.target.value.replace(/\D/g, '');
                setNuevaTarjeta({ ...nuevaTarjeta, cvv: valor });
              }}
              maxLength={4}
            />
          </div>

          <div className="flex gap-3 justify-end pr-12 md:pr-16">
            <Button variant="ghost" onClick={() => setMostrarFormulario(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleAgregarTarjeta} isLoading={isSaving}>
              Agregar
            </Button>
          </div>
        </div>
      )}

      {/* Lista de tarjetas */}
      <div className="space-y-4">
        {tarjetas.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <CreditCardIcon size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No tienes tarjetas guardadas</p>
          </div>
        ) : (
          tarjetas.map((tarjeta) => (
            <div
              key={tarjeta.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                tarjeta.isDefault
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {/* Ícono + tipo + etiqueta predeterminada a la izquierda */}
                    <div className="flex items-center gap-2">
                      {obtenerIconoTarjeta(tarjeta.cardType)}
                      {tarjeta.isDefault && (
                        <span className="bg-primary-400 text-white text-xs px-2 py-1 rounded-full">
                          Predeterminada
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-700">{tarjeta.cardholderName}</p>
                  <p className="text-gray-600 text-sm font-mono">
                    •••• •••• •••• {tarjeta.last4Digits}
                  </p>
                  <p className="text-gray-500 text-xs">Vence: {tarjeta.expirationDate}</p>
                </div>


                <div className="flex gap-2">
                  {!tarjeta.isDefault && (
                    <button
                      onClick={() => handleMarcarPredeterminada(tarjeta.id)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Marcar como predeterminada"
                    >
                      <CheckCircleIcon size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => handleEliminarTarjeta(tarjeta.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <TrashIcon size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Tus datos de pago están encriptados y seguros. Nunca compartimos esta información.
        </p>
      </div>
    </div>
  );
};

export default TarjetasPanel;
