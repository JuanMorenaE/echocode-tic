'use client';

import { Producto } from '@/types/producto.types';
import { PencilSimpleIcon, TrashIcon, PizzaIcon, HamburgerIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';

interface ProductoTableProps {
  productos: Producto[];
  onEdit: (producto: Producto) => void;
  onDelete: (producto: Producto) => void; // ← Cambiar de "id: number" a "producto: Producto"
}

export const ProductoTable = ({ productos, onEdit, onDelete }: ProductoTableProps) => {
  const getTipoIcon = (tipo: string) => {
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
  };

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
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Producto</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Tipo</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Descripción</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Precio</th>
              <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {productos.map((producto) => (
              <tr key={producto.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg flex items-center justify-center">
                      {getTipoIcon(producto.tipo || '')}
                    </div>
                    <span className="font-medium text-gray-900">{producto.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  {getTipoBadge(producto.tipo || 'PIZZA')}
                </td>
                <td className="py-4 px-6 max-w-xs">
                  <p className="text-sm text-gray-600 truncate">{producto.description}</p>
                </td>
                <td className="py-4 px-6 text-right font-semibold text-gray-900">
                  ${producto.price}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(producto)}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <PencilSimpleIcon size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(producto)} // ← Pasar el producto completo
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

      {productos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay productos registrados</p>
        </div>
      )}
    </div>
  );
};