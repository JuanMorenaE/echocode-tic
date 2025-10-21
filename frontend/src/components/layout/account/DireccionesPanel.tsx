"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MapPinIcon, PlusIcon, TrashIcon, CheckCircleIcon } from '@/components/icons';
import addressApi from '@/services/api/addressApi';
import type { Address, AddressRequest } from '@/types/address.types';

const DireccionesPanel: React.FC = () => {
  const [direcciones, setDirecciones] = useState<Address[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [nuevaDireccion, setNuevaDireccion] = useState<Partial<AddressRequest>>({
    alias: '',
    street: '',
    number: '',
    apartmentNumber: '',
    city: '',
    zipCode: '',
    additionalInfo: '',
    isDefault: false,
  });

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

  const handleAgregarDireccion = async () => {
    if (!nuevaDireccion.alias || !nuevaDireccion.street || !nuevaDireccion.number || !nuevaDireccion.city || !nuevaDireccion.zipCode) {
      alert('Por favor completa los campos obligatorios (Alias, Calle, Número, Ciudad, Código Postal)');
      return;
    }

    setIsSaving(true);
    try {
      const request: AddressRequest = {
        alias: nuevaDireccion.alias!,
        street: nuevaDireccion.street!,
        number: nuevaDireccion.number!,
        apartmentNumber: nuevaDireccion.apartmentNumber || '',
        city: nuevaDireccion.city!,
        zipCode: nuevaDireccion.zipCode!,
        additionalInfo: nuevaDireccion.additionalInfo || '',
        isDefault: nuevaDireccion.isDefault || false,
      };

      await addressApi.create(request);
      await loadAddresses(); // Recargar lista

      // Resetear formulario
      setNuevaDireccion({
        alias: '',
        street: '',
        number: '',
        apartmentNumber: '',
        city: '',
        zipCode: '',
        additionalInfo: '',
        isDefault: false,
      });
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Error creando dirección:', error);
      alert('Error al guardar la dirección');
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
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="flex items-center gap-2"
        >
          <PlusIcon size={20} />
          Nueva Dirección
        </Button>
      </div>

      {/* Formulario para nueva dirección */}
      {mostrarFormulario && (
        <div className="bg-gray-50 p-6 rounded-lg space-y-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Agregar Dirección</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Alias *"
              placeholder="Ej: Casa, Trabajo"
              value={nuevaDireccion.alias}
              onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, alias: e.target.value })}
            />

            <Input
              label="Calle *"
              placeholder="Ej: Av. 18 de Julio"
              value={nuevaDireccion.street}
              onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, street: e.target.value })}
            />

            <Input
              label="Número *"
              placeholder="1234"
              value={nuevaDireccion.number}
              onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, number: e.target.value })}
            />

            <Input
              label="Apartamento"
              placeholder="301"
              value={nuevaDireccion.apartmentNumber}
              onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, apartmentNumber: e.target.value })}
            />

            <Input
              label="Ciudad *"
              placeholder="Montevideo"
              value={nuevaDireccion.city}
              onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, city: e.target.value })}
            />

            <Input
              label="Código Postal *"
              placeholder="11200"
              value={nuevaDireccion.zipCode}
              onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, zipCode: e.target.value })}
            />

            <div className="md:col-span-2">
              <Input
                label="Información adicional"
                placeholder="Ej: Portón verde, Timbre 2"
                value={nuevaDireccion.additionalInfo}
                onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, additionalInfo: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pr-12 md:pr-16">
            <Button variant="ghost" onClick={() => setMostrarFormulario(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleAgregarDireccion} isLoading={isSaving}>
              Agregar
            </Button>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default DireccionesPanel;
