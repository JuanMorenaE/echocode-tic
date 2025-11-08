"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { MapPinIcon, PlusIcon, TrashIcon, CheckCircleIcon } from '@/components/icons';
import addressApi from '@/services/api/addressApi';
import DireccionModal from './DireccionModal';
import type { Address, AddressRequest } from '@/types/address.types';

const DireccionesPanel: React.FC = () => {
  const [direcciones, setDirecciones] = useState<Address[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Cargar direcciones al montar el componente
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setIsLoading(true);
    try {
      const data = await addressApi.getAll();
      setDirecciones(data);
    } catch (error) {
      console.error('Error cargando direcciones:', error);
      alert('Error al cargar las direcciones');
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
    } catch (error) {
      console.error('Error creando dirección:', error);
      alert('Error al guardar la dirección');
      throw error; // Re-lanzar el error para que el modal lo maneje
    } finally {
      setIsSaving(false);
    }
  };

  const handleEliminarDireccion = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta dirección?')) {
      return;
    }

    try {
      await addressApi.delete(id);
      await loadAddresses(); // Recargar lista
    } catch (error) {
      console.error('Error eliminando dirección:', error);
      alert('Error al eliminar la dirección');
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
    } catch (error) {
      console.error('Error marcando dirección como predeterminada:', error);
      alert('Error al actualizar la dirección');
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
                    onClick={() => handleEliminarDireccion(direccion.id)}
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

      {/* Modal para agregar dirección */}
      <DireccionModal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onSubmit={handleAgregarDireccion}
        isSaving={isSaving}
      />
    </div>
  );
};

export default DireccionesPanel;
