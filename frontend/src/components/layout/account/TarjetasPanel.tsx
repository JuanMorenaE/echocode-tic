"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CreditCardIcon, PlusIcon, TrashIcon, CheckCircleIcon } from '@/components/icons';

interface Tarjeta {
  id: number;
  alias: string;
  titular: string;
  ultimos4Digitos: string;
  tipoTarjeta: 'visa' | 'mastercard' | 'amex' | 'otra';
  fechaVencimiento: string;
  esPredeterminada: boolean;
}

const TarjetasPanel: React.FC = () => {
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([
    {
      id: 1,
      alias: 'Visa Personal',
      titular: 'Juan Pérez',
      ultimos4Digitos: '4242',
      tipoTarjeta: 'visa',
      fechaVencimiento: '12/25',
      esPredeterminada: true,
    },
    {
      id: 2,
      alias: 'Mastercard',
      titular: 'Juan Pérez',
      ultimos4Digitos: '8888',
      tipoTarjeta: 'mastercard',
      fechaVencimiento: '08/26',
      esPredeterminada: false,
    },
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaTarjeta, setNuevaTarjeta] = useState<Partial<Tarjeta & { numeroCompleto: string; cvv: string }>>({
    alias: '',
    titular: '',
    numeroCompleto: '',
    tipoTarjeta: 'visa',
    fechaVencimiento: '',
    cvv: '',
    esPredeterminada: false,
  });

  const detectarTipoTarjeta = (numero: string): 'visa' | 'mastercard' | 'amex' | 'otra' => {
    const primerDigito = numero[0];
    if (primerDigito === '4') return 'visa';
    if (primerDigito === '5') return 'mastercard';
    if (primerDigito === '3') return 'amex';
    return 'otra';
  };

  const handleAgregarTarjeta = () => {
    if (!nuevaTarjeta.alias || !nuevaTarjeta.titular || !nuevaTarjeta.numeroCompleto || !nuevaTarjeta.fechaVencimiento || !nuevaTarjeta.cvv) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Validar formato de número (solo dígitos, 16 caracteres)
    const soloDigitos = nuevaTarjeta.numeroCompleto!.replace(/\s/g, '');
    if (soloDigitos.length < 15 || soloDigitos.length > 16) {
      alert('Número de tarjeta inválido');
      return;
    }

    const ultimos4 = soloDigitos.slice(-4);
    const tipo = detectarTipoTarjeta(soloDigitos);

    const tarjeta: Tarjeta = {
      id: Date.now(),
      alias: nuevaTarjeta.alias!,
      titular: nuevaTarjeta.titular!,
      ultimos4Digitos: ultimos4,
      tipoTarjeta: tipo,
      fechaVencimiento: nuevaTarjeta.fechaVencimiento!,
      esPredeterminada: false,
    };

    setTarjetas([...tarjetas, tarjeta]);
    setNuevaTarjeta({
      alias: '',
      titular: '',
      numeroCompleto: '',
      tipoTarjeta: 'visa',
      fechaVencimiento: '',
      cvv: '',
      esPredeterminada: false,
    });
    setMostrarFormulario(false);
  };

  const handleEliminarTarjeta = (id: number) => {
    setTarjetas(tarjetas.filter(t => t.id !== id));
  };

  const handleMarcarPredeterminada = (id: number) => {
    setTarjetas(
      tarjetas.map(t => ({
        ...t,
        esPredeterminada: t.id === id,
      }))
    );
  };

  const obtenerIconoTarjeta = (tipo: string) => {
    switch (tipo) {
      case 'visa':
        return '💳 Visa';
      case 'mastercard':
        return '💳 Mastercard';
      case 'amex':
        return '💳 Amex';
      default:
        return '💳 Otra';
    }
  };

  const formatearNumero = (valor: string) => {
    const soloDigitos = valor.replace(/\D/g, '');
    const grupos = soloDigitos.match(/.{1,4}/g);
    return grupos ? grupos.join(' ') : soloDigitos;
  };

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
                value={nuevaTarjeta.titular}
                onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, titular: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Número de Tarjeta *"
                placeholder="1234 5678 9012 3456"
                value={nuevaTarjeta.numeroCompleto}
                onChange={(e) => {
                  const formateado = formatearNumero(e.target.value);
                  setNuevaTarjeta({ ...nuevaTarjeta, numeroCompleto: formateado });
                }}
                maxLength={19}
              />
            </div>

            <Input
              label="Vencimiento *"
              placeholder="MM/AA"
              value={nuevaTarjeta.fechaVencimiento}
              onChange={(e) => {
                let valor = e.target.value.replace(/\D/g, '');
                if (valor.length >= 2) {
                  valor = valor.slice(0, 2) + '/' + valor.slice(2, 4);
                }
                setNuevaTarjeta({ ...nuevaTarjeta, fechaVencimiento: valor });
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
            <Button variant="ghost" onClick={() => setMostrarFormulario(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAgregarTarjeta}>
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
                tarjeta.esPredeterminada
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{obtenerIconoTarjeta(tarjeta.tipoTarjeta)}</span>
                    <h3 className="font-semibold text-gray-900">{tarjeta.alias}</h3>
                    {tarjeta.esPredeterminada && (
                      <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                        Predeterminada
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700">{tarjeta.titular}</p>
                  <p className="text-gray-600 text-sm font-mono">
                    •••• •••• •••• {tarjeta.ultimos4Digitos}
                  </p>
                  <p className="text-gray-500 text-xs">Vence: {tarjeta.fechaVencimiento}</p>
                </div>

                <div className="flex gap-2 pr-12 md:pr-16">
                  {!tarjeta.esPredeterminada && (
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
