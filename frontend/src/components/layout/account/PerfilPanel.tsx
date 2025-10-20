"use client";

import React, { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PencilSimpleIcon } from '@/components/icons';

const PerfilPanel: React.FC = () => {
  const { state } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Estado para los datos editables
  const [formData, setFormData] = useState({
    firstName: state?.user?.firstName || '',
    lastName: state?.user?.lastName || '',
    email: state?.user?.email || '',
    phoneNumber: state?.user?.phoneNumber || '',
    cedula: state?.user?.cedula || '',
    birthdate: state?.user?.birthdate || '',
  });

  const handleActualizar = async () => {
    setIsSaving(true);
    try {
      // TODO: Conectar con API para actualizar perfil
      // await updateProfile(formData);

      // Simulación de delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsEditing(false);
      // TODO: Actualizar el estado global del auth con los nuevos datos
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelar = () => {
    // Restaurar datos originales
    setFormData({
      firstName: state?.user?.firstName || '',
      lastName: state?.user?.lastName || '',
      email: state?.user?.email || '',
      phoneNumber: state?.user?.phoneNumber || '',
      cedula: state?.user?.cedula || '',
      birthdate: state?.user?.birthdate || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mi Perfil</h2>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <PencilSimpleIcon size={20} />
            Editar
          </Button>
        )}
      </div>

      {isEditing ? (
        // Modo edición
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />

            <Input
              label="Apellido"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <Input
              label="Teléfono"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />

            <Input
              label="Cédula"
              value={formData.cedula}
              onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
            />

            <Input
              label="Fecha de nacimiento"
              type="date"
              value={formData.birthdate}
              onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="ghost" onClick={handleCancelar} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleActualizar} isLoading={isSaving}>
              Actualizar
            </Button>
          </div>
        </div>
      ) : (
        // Modo visualización
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Nombre</p>
            <p className="font-medium text-gray-900">{formData.firstName}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Apellido</p>
            <p className="font-medium text-gray-900">{formData.lastName}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="font-medium text-gray-900">{formData.email}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Teléfono</p>
            <p className="font-medium text-gray-900">{formData.phoneNumber || 'No especificado'}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Cédula</p>
            <p className="font-medium text-gray-900">{formData.cedula || 'No especificada'}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Fecha de nacimiento</p>
            <p className="font-medium text-gray-900">{formData.birthdate || 'No especificada'}</p>
          </div>
        </div>
      )}
      <div className="flex justify-end pr-12 md:pr-16 mt-2">
        {/* espacio a la derecha para no solapar con el boton cerrar del AccountArea */}
      </div>
    </div>
  );
};

export default PerfilPanel;
