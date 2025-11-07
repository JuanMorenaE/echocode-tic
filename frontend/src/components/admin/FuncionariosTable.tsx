'use client';

import { Funcionario } from '@/types/employes.types';
import { PencilSimpleIcon, TrashIcon, PizzaIcon, HamburgerIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

interface FuncionarioTableProps {
  funcionarios: Funcionario[];
  onEdit: (funcionario: Funcionario) => void;
  onDelete: (funcionario: Funcionario) => void; // ← Cambiar de "id: number" a "funcionario: Funcionario"
}

export const FuncionarioTable = ({ funcionarios, onEdit, onDelete }: FuncionarioTableProps) => {
  /**const getTipoIcon = (tipo: string) => {
    switch(tipo) {
      case "PIZZA":
        return <PizzaIcon size={24} weight="fill" className="text-primary-600" />;
        break;

      case "BURGER":
        return <HamburgerIcon size={24} weight="fill" className="text-primary-600" />;
        break;

      case "BURGER":
        return <HamburgerIcon size={24} weight="fill" className="text-primary-600" />;
        break;

      default:
        return '📦';
    };
  };/** */


  const getTipoBadge = (tipo: string) => {
    const colors: Record<string, string> = {
      PIZZA: 'bg-red-100 text-red-800',
      HAMBURGUESA: 'bg-orange-100 text-orange-800',
      ACOMPAÑAMIENTO: 'bg-yellow-100 text-yellow-800',
      BEBIDA: 'bg-blue-100 text-blue-800',
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors[tipo] || 'bg-gray-100 text-gray-800'}`}>
        {tipo}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Nombre completo</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Fecha de ingreso</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Rol</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Email</th>
              <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Teléfono</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Domicilio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {funcionarios.map((funcionario) => (
              <tr key={funcionario.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg flex items-center justify-center">
                    </div>
                    <span className="font-medium text-gray-900">{funcionario.full_name}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                </td>
                <td className="py-4 px-6 max-w-xs">
                  <p className="text-sm text-gray-600 truncate">{funcionario.email}</p>
                </td>
                <td className="py-4 px-6 text-right font-semibold text-gray-900">
                    {funcionario.phone_number}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(funcionario)}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <PencilSimpleIcon size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(funcionario)} // ← Pasar el funcionario completo
                      className="text-red-600 hover:bg-red-50"
                    >
                      <TrashIcon size={18} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {funcionarios.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay funcionarios registrados</p>
        </div>
      )}
    </div>
  );
};