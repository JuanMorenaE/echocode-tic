"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { CreditCardIcon, PlusIcon, TrashIcon, CheckCircleIcon } from '@/components/icons';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/context/ToastContext';
import cardApi from '@/services/api/cardApi';
import TarjetaModal from './TarjetaModal';
import type { Card, CardRequest, CardType } from '@/types/card.types';

const TarjetasPanel: React.FC = () => {
  const { success, error } = useToast();
  const [tarjetas, setTarjetas] = useState<Card[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ show: boolean; id: number | null }>({ show: false, id: null });

  // Cargar tarjetas al montar el componente
  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setIsLoading(true);
    try {
      const data = await cardApi.getAll();
      setTarjetas(data);
    } catch (err) {
      console.error('Error cargando tarjetas:', err);
      error('Error al cargar las tarjetas');
    } finally {
      setIsLoading(false);
    }
  };


  const handleAgregarTarjeta = async (request: CardRequest) => {
    setIsSaving(true);
    try {
      await cardApi.create(request);
      await loadCards(); // Recargar lista
      setMostrarModal(false);
      success('Tarjeta agregada correctamente');
    } catch (err) {
      console.error('Error creando tarjeta:', err);
      error('Error al guardar la tarjeta');
      throw err; // Re-lanzar el error para que el modal lo maneje
    } finally {
      setIsSaving(false);
    }
  };

  const handleEliminarTarjeta = async () => {
    if (confirmDelete.id === null) return;

    // Verificar si es predeterminada antes de intentar eliminar
    const tarjeta = tarjetas.find(t => t.id === confirmDelete.id);
    if (tarjeta?.isDefault) {
      error('No puedes eliminar la tarjeta predeterminada. Marca otra como predeterminada primero.');
      setConfirmDelete({ show: false, id: null });
      return;
    }

    try {
      await cardApi.delete(confirmDelete.id);
      await loadCards(); // Recargar lista
      success('Tarjeta eliminada correctamente');
    } catch (err: any) {
      console.error('Error eliminando tarjeta:', err);

      // Manejo específico de errores de Axios
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.error;

        if (status === 404) {
          error('La tarjeta no existe o ya fue eliminada');
        } else if (status === 400 || status === 409) {
          error(message || 'No se puede eliminar esta tarjeta');
        } else if (status === 403) {
          error('No tienes permisos para eliminar esta tarjeta');
        } else {
          error('Error al eliminar la tarjeta. Intenta nuevamente.');
        }
      } else if (err.request) {
        error('Error de conexión. Verifica tu internet.');
      } else {
        error('Error inesperado al eliminar la tarjeta');
      }
    } finally {
      setConfirmDelete({ show: false, id: null });
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
      success('Tarjeta predeterminada actualizada');
    } catch (err) {
      console.error('Error marcando tarjeta como predeterminada:', err);
      error('Error al actualizar la tarjeta');
    }
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
          onClick={() => setMostrarModal(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon size={20} />
          Nueva Tarjeta
        </Button>
      </div>

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
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{tarjeta.alias}</h4>
                    {tarjeta.isDefault && (
                      <span className="bg-primary-400 text-white text-xs px-2 py-0.5 rounded-full">
                        Predeterminada
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm">{tarjeta.cardholderName}</p>
                  <p className="text-gray-600 text-sm font-mono">
                    •••• •••• •••• {tarjeta.last4Digits}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {tarjeta.cardType} - Vence: {tarjeta.expirationDate}
                  </p>
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
                    onClick={() => setConfirmDelete({ show: true, id: tarjeta.id })}
                    disabled={tarjeta.isDefault}
                    className={`p-2 rounded-lg transition-colors ${
                      tarjeta.isDefault
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                    }`}
                    title={tarjeta.isDefault ? 'No puedes eliminar la tarjeta predeterminada' : 'Eliminar'}
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

      {/* Modal para agregar tarjeta */}
      <TarjetaModal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onSubmit={handleAgregarTarjeta}
        isSaving={isSaving}
      />

      {/* Modal de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={confirmDelete.show}
        onClose={() => setConfirmDelete({ show: false, id: null })}
        onConfirm={handleEliminarTarjeta}
        title="Eliminar tarjeta"
        message="¿Estás seguro de que deseas eliminar esta tarjeta? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default TarjetasPanel;
