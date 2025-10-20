"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MapPinIcon, PlusIcon, TrashIcon, CheckCircleIcon } from '@/components/icons';

interface Direccion {
  id: number;
  alias: string;
  calle: string;
  numero: string;
  apartamento?: string;
  ciudad: string;
  departamento: string;
  codigoPostal: string;
  esPredeterminada: boolean;
}

const DireccionesPanel: React.FC = () => {
  const [direcciones, setDirecciones] = useState<Direccion[]>([
    {
      id: 1,
      alias: 'Casa',
      calle: 'Av. 18 de Julio',
      numero: '1234',
      ciudad: 'Montevideo',
      departamento: 'Montevideo',
      codigoPostal: '11200',
      esPredeterminada: true,
    },
    {
      id: 2,
      alias: 'Trabajo',
      calle: 'Bulevar Artigas',
      numero: '5678',
      apartamento: '301',
      ciudad: 'Montevideo',
      departamento: 'Montevideo',
      codigoPostal: '11300',
      esPredeterminada: false,
    },
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaDireccion, setNuevaDireccion] = useState<Partial<Direccion>>({
    alias: '',
    calle: '',
    numero: '',
    apartamento: '',
    ciudad: '',
    departamento: '',
    codigoPostal: '',
    esPredeterminada: false,
  });

  const handleAgregarDireccion = () => {
    if (!nuevaDireccion.alias || !nuevaDireccion.calle || !nuevaDireccion.numero || !nuevaDireccion.ciudad) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    const direccion: Direccion = {
      id: Date.now(),
      alias: nuevaDireccion.alias!,
      calle: nuevaDireccion.calle!,
      numero: nuevaDireccion.numero!,
      apartamento: nuevaDireccion.apartamento,
      ciudad: nuevaDireccion.ciudad!,
      departamento: nuevaDireccion.departamento || '',
      codigoPostal: nuevaDireccion.codigoPostal || '',
      esPredeterminada: false,
    };

    setDirecciones([...direcciones, direccion]);
    setNuevaDireccion({
      alias: '',
      calle: '',
      numero: '',
      apartamento: '',
      ciudad: '',
      departamento: '',
      codigoPostal: '',
      esPredeterminada: false,
    });
    setMostrarFormulario(false);
  };

  const handleEliminarDireccion = (id: number) => {
    setDirecciones(direcciones.filter(d => d.id !== id));
  };

  const handleMarcarPredeterminada = (id: number) => {
    setDirecciones(
      direcciones.map(d => ({
        ...d,
        esPredeterminada: d.id === id,
      }))
    );
  };

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
              value={nuevaDireccion.calle}
              onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, calle: e.target.value })}
            />

            <Input
              label="Número *"
              placeholder="1234"
              value={nuevaDireccion.numero}
              onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, numero: e.target.value })}
            />

            <Input
              label="Apartamento"
              placeholder="301"
              value={nuevaDireccion.apartamento}
              onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, apartamento: e.target.value })}
            />

            <Input
              label="Ciudad *"
              placeholder="Montevideo"
              value={nuevaDireccion.ciudad}
              onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, ciudad: e.target.value })}
            />

            <Input
              label="Departamento"
              placeholder="Montevideo"
              value={nuevaDireccion.departamento}
              onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, departamento: e.target.value })}
            />

            <Input
              label="Código Postal"
              placeholder="11200"
              value={nuevaDireccion.codigoPostal}
              onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, codigoPostal: e.target.value })}
            />
          </div>

          <div className="flex gap-3 justify-end pr-12 md:pr-16">
            <Button variant="ghost" onClick={() => setMostrarFormulario(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAgregarDireccion}>
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
                direccion.esPredeterminada
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPinIcon size={20} className="text-gray-600" />
                    <h3 className="font-semibold text-gray-900">{direccion.alias}</h3>
                    {direccion.esPredeterminada && (
                      <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                        Predeterminada
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700">
                    {direccion.calle} {direccion.numero}
                    {direccion.apartamento && `, Apto ${direccion.apartamento}`}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {direccion.ciudad}, {direccion.departamento} {direccion.codigoPostal}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!direccion.esPredeterminada && (
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
