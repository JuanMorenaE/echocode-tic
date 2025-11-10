"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { MapPinIcon, PlusIcon, TrashIcon, CheckCircleIcon } from '@/components/icons';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/context/ToastContext';
import addressApi from '@/services/api/addressApi';
import DireccionModal from './DireccionModal';
import type { Address, AddressRequest } from '@/types/address.types';

const DireccionesPanel: React.FC = () => {
  const { success, error } = useToast();
  const [direcciones, setDirecciones] = useState<Address[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ show: boolean; id: number | null }>({ show: false, id: null });

  // Cargar direcciones al montar el componente
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setIsLoading(true);
    try {
      const data = await addressApi.getAll();
      setDirecciones(data);
    } catch (err) {
      console.error('Error cargando direcciones:', err);
      error('Error al cargar las direcciones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgregarDireccion = async (request: AddressRequest) => {
    setIsSaving(true);
    try {
      await addressApi.create(request);
      await loadAddresses(); // Recargar lista
      setMostrarModal(false);
      success('Dirección agregada correctamente');
    } catch (err) {
      console.error('Error creando dirección:', err);
      error('Error al guardar la dirección');
      throw err; // Re-lanzar el error para que el modal lo maneje
    } finally {
      setIsSaving(false);
    }
  };

  const handleEliminarDireccion = async () => {
    if (confirmDelete.id === null) return;

    // Verificar si es predeterminada antes de intentar eliminar
    const direccion = direcciones.find(d => d.id === confirmDelete.id);
    if (direccion?.isDefault) {
      error('No puedes eliminar la dirección predeterminada. Marca otra como predeterminada primero.');
      setConfirmDelete({ show: false, id: null });
      return;
    }

    try {
      await addressApi.delete(confirmDelete.id);
      await loadAddresses(); // Recargar lista
      success('Dirección eliminada correctamente');
    } catch (err: any) {
      console.error('Error eliminando dirección:', err);

      // Manejo específico de errores de Axios
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.error;

        if (status === 404) {
          error('La dirección no existe o ya fue eliminada');
        } else if (status === 400 || status === 409) {
          error(message || 'No se puede eliminar esta dirección');
        } else if (status === 403) {
          error('No tienes permisos para eliminar esta dirección');
        } else {
          error('Error al eliminar la dirección. Intenta nuevamente.');
        }
      } else if (err.request) {
        error('Error de conexión. Verifica tu internet.');
      } else {
        error('Error inesperado al eliminar la dirección');
      }
    } finally {
      setConfirmDelete({ show: false, id: null });
    }
  };

  const handleMarcarPredeterminada = async (id: number) => {
    try {
      const direccion = direcciones.find(d => d.id === id);
      if (!direccion) return;

      const request: AddressRequest = {
        alias: direccion.alias,
        street: direccion.street,
        number: direccion.number,
        apartmentNumber: direccion.apartmentNumber,
        city: direccion.city,
        zipCode: direccion.zipCode,
        additionalInfo: direccion.additionalInfo,
        isDefault: true,
      };

      await addressApi.update(id, request);
      await loadAddresses(); // Recargar lista
      success('Dirección predeterminada actualizada');
    } catch (err) {
      console.error('Error marcando dirección como predeterminada:', err);
      error('Error al actualizar la dirección');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-600">Cargando direcciones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mis Direcciones</h2>
        <Button
          onClick={() => setMostrarModal(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon size={20} />
          Nueva Dirección
        </Button>
      </div>

      {/* Lista de direcciones */}
      <div className="space-y-4">
        {direcciones.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <MapPinIcon size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No tienes direcciones guardadas</p>
          </div>
        ) : (
          direcciones.map((direccion) => (
            <div
              key={direccion.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                direccion.isDefault
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPinIcon size={20} className="text-gray-600" />
                    <h3 className="font-semibold text-gray-900">{direccion.alias}</h3>
                    {direccion.isDefault && (
                      <span className="bg-primary-400 text-white text-xs px-2 py-1 rounded-full">
                        Predeterminada
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700">
                    {direccion.street} {direccion.number}
                    {direccion.apartmentNumber && `, Apto ${direccion.apartmentNumber}`}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {direccion.city}, CP {direccion.zipCode}
                  </p>
                  {direccion.additionalInfo && (
                    <p className="text-gray-500 text-sm italic mt-1">
                      {direccion.additionalInfo}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  {!direccion.isDefault && (
                    <button
                      onClick={() => handleMarcarPredeterminada(direccion.id)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Marcar como predeterminada"
                    >
                      <CheckCircleIcon size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => setConfirmDelete({ show: true, id: direccion.id })}
                    disabled={direccion.isDefault}
                    className={`p-2 rounded-lg transition-colors ${
                      direccion.isDefault
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                    }`}
                    title={direccion.isDefault ? 'No puedes eliminar la dirección predeterminada' : 'Eliminar'}
                  >
                    <TrashIcon size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal para agregar dirección */}
      <DireccionModal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onSubmit={handleAgregarDireccion}
        isSaving={isSaving}
      />

      {/* Modal de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={confirmDelete.show}
        onClose={() => setConfirmDelete({ show: false, id: null })}
        onConfirm={handleEliminarDireccion}
        title="Eliminar dirección"
        message="¿Estás seguro de que deseas eliminar esta dirección? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default DireccionesPanel;
