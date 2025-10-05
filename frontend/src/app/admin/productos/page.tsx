'use client';

import { useState } from 'react';
import { ProductoTable } from '@/components/admin/ProductoTable';
import { ProductoForm } from '@/components/admin/ProductoForm';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { PlusIcon, MagnifyingGlassIcon } from '@/components/icons';
import { Producto } from '@/types/producto.types';
import { useToast } from '@/context/ToastContext';

export default function ProductosPage() {
  const { success, error } = useToast();
  
  const [productos, setProductos] = useState<Producto[]>([
    { id: 1, tipo: 'PIZZA', name: 'Napolitana', price: 580, description: 'Salsa de tomate, mozzarella fresca, albahaca' },
    { id: 2, tipo: 'PIZZA', name: 'Pepperoni XL', price: 620, description: 'Doble pepperoni, mozzarella, orégano' },
    { id: 3, tipo: 'HAMBURGUESA', name: 'BBQ Bacon', price: 520, description: 'Carne premium, bacon crocante, queso cheddar' },
    { id: 4, tipo: 'HAMBURGUESA', name: 'Mega Cheese', price: 480, description: 'Doble carne, triple queso' },
    { id: 5, tipo: 'BEBIDA', name: 'Coca Cola 500ml', price: 80, description: 'Bebida refrescante' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; producto?: Producto }>({
    isOpen: false,
  });

  const handleCreateProducto = (data: Partial<Producto>) => {
    const newProducto: Producto = {
      id: Math.max(...productos.map(p => p.id), 0) + 1,
      ...data,
    } as Producto;

    setProductos([...productos, newProducto]);
    setIsModalOpen(false);
    success(`Producto "${data.name}" creado exitosamente`);
  };

  const handleEditProducto = (data: Partial<Producto>) => {
    setProductos(productos.map(p => 
      p.id === editingProducto?.id ? { ...p, ...data } : p
    ));
    setIsModalOpen(false);
    setEditingProducto(undefined);
    success(`Producto "${data.name}" actualizado exitosamente`);
  };

  const openDeleteConfirm = (producto: Producto) => {
    setDeleteConfirm({ isOpen: true, producto });
  };

  const handleDeleteProducto = () => {
    if (deleteConfirm.producto) {
      setProductos(productos.filter(p => p.id !== deleteConfirm.producto!.id));
      success(`Producto "${deleteConfirm.producto.name}" eliminado exitosamente`);
      setDeleteConfirm({ isOpen: false });
    }
  };

  const openCreateModal = () => {
    setEditingProducto(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (producto: Producto) => {
    setEditingProducto(producto);
    setIsModalOpen(true);
  };

  const filteredProductos = productos.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600 mt-2">
            Gestiona el catálogo de pizzas, hamburguesas y más
          </p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <PlusIcon size={20} />
          Nuevo Producto
        </Button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <MagnifyingGlassIcon size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabla de productos */}
      <ProductoTable
        productos={filteredProductos}
        onEdit={openEditModal}
        onDelete={openDeleteConfirm}
      />

      {/* Modal de crear/editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProducto ? 'Editar Producto' : 'Nuevo Producto'}
        size="lg"
      >
        <ProductoForm
          producto={editingProducto}
          onSubmit={editingProducto ? handleEditProducto : handleCreateProducto}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Diálogo de confirmación de eliminación */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false })}
        onConfirm={handleDeleteProducto}
        title="¿Eliminar producto?"
        message={`Estás a punto de eliminar "${deleteConfirm.producto?.name}". Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}