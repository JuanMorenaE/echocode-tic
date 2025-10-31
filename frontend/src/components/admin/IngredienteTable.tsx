'use client';

import { Ingrediente } from '@/types/ingrediente.types';
import { PencilSimpleIcon, TrashIcon, PizzaIcon, HamburgerIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';

interface IngredienteTableProps {
  ingredientes: Ingrediente[];
  onEdit: (ingrediente: Ingrediente) => void;
  onDelete: (ingrediente: Ingrediente) => void;
}

export const IngredienteTable = ({ ingredientes, onEdit, onDelete }: IngredienteTableProps) => {
  const getTipoIcon = (tipo: string) => {
    if (tipo === 'PIZZA') return <PizzaIcon size={24} weight="fill" className="text-primary-600" />;
    if (tipo === 'BURGER') return <HamburgerIcon size={24} weight="fill" className="text-primary-600" />;
    return '🍴';
  };

  const getTipoBadge = (tipo: string) => {
    return tipo === 'PIZZA'
      ? 'bg-red-100 text-red-800'
      : 'bg-orange-100 text-orange-800';
  };

  const getCategoriaBadge = (categoria: string) => {
    const colors: Record<string, string> = {
      MASA: 'bg-amber-100 text-amber-800',
      SALSA: 'bg-red-100 text-red-800',
      QUESO: 'bg-yellow-100 text-yellow-800',
      TOPPING: 'bg-green-100 text-green-800',
      PAN: 'bg-amber-100 text-amber-800',
      CARNE: 'bg-red-100 text-red-800',
      ADEREZO: 'bg-yellow-100 text-yellow-800',
      VEGETAL: 'bg-green-100 text-green-800',
      EXTRA: 'bg-purple-100 text-purple-800',
    };

    return colors[categoria] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-auto grow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Ingrediente</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Tipo</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Categoría</th>
              <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Cantidad</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Precio</th>
              <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ingredientes.map((ingrediente) => 
              (
                <tr key={ingrediente.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg flex items-center justify-center">
                        {getTipoIcon(ingrediente.type)}
                      </div>
                      <span className="font-medium text-gray-900">{ingrediente.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoBadge(ingrediente.type)}`}>
                      {ingrediente.type == 'BURGER' ? 'HAMBURGUESA' : 'PIZZA'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoriaBadge(ingrediente.category)}`}>
                      {ingrediente.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center font-medium text-gray-900">
                    x{ingrediente.quantity}
                  </td>
                  <td className="py-4 px-6 text-right font-semibold text-gray-900">
                    ${ingrediente.price}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(ingrediente)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <PencilSimpleIcon size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(ingrediente)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <TrashIcon size={18} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ) 
            )}
          </tbody>
        </table>
      </div>

      {ingredientes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay ingredientes registrados</p>
        </div>
      )}
    </div>
  );
};
