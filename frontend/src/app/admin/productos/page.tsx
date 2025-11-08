'use client';

import { useEffect, useState } from 'react';
import { ProductoTable } from '@/components/admin/ProductoTable';
import { ProductoForm } from '@/components/admin/ProductoForm';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PlusIcon, MagnifyingGlassIcon } from '@/components/icons';
import { Producto } from '@/types/producto.types';
import { useToast } from '@/context/ToastContext';
import { SpinnerGapIcon } from '@phosphor-icons/react';
import api from '@/lib/axios/axiosConfig';

export default function ProductosPage() {
  const { success, error } = useToast();
  
  const [loading, setLoading] = useState<boolean>(true);

  const [token, setToken] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      try{
  setLoading(true);
  const resp = await api.get<Producto[]>('/v1/products');
  const data = resp.data;

  console.log(data);
  setProductos(data);
      }catch(ex){
        console.error(ex)
        error("Ocurrio un error inesperado, contacta a un administrador.")
      }finally{
        setLoading(false)
      }
    }

    fetchData()
  }, [])


  useEffect(() => {
    setToken(localStorage.getItem('token') ?? "")
  }, []);

  const [productos, setProductos] = useState<Producto[]>([
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; producto?: Producto }>({
    isOpen: false,
  });

  const handleCreateProducto = async (data: Producto) => {
    const { id, ...newProduct} = data;

    console.log(newProduct)
    
    try{
      const resp = await api.post('/v1/products', newProduct);
      const created = resp.data;

      setProductos([...productos, created]);
      setIsModalOpen(false);
      success(`Producto "${created.name}" creado exitosamente`);
    }catch(ex){
      console.error(ex)
      error("Ocurrio un error inesperado, contacta a un administrador.")
    }
  };

  const handleEditProducto = async (data: Producto) => {
    try {
      const { id, ...updateData } = data;
      await api.put(`/v1/products/${id}`, updateData);

      setProductos(productos.map(p =>
        p.id === id ? data : p
      ));
      setIsModalOpen(false);
      setEditingProducto(undefined);
      success(`Producto "${data.name}" actualizado exitosamente`);
    } catch (ex) {
      console.error(ex);
      error("Ocurrió un error al actualizar el producto.");
    }
  };

  const openDeleteConfirm = (producto: Producto) => {
    setDeleteConfirm({ isOpen: true, producto });
  };

  const handleDeleteProducto = async () => {
    if (deleteConfirm.producto) {
      try {
        await api.delete(`/v1/products/${deleteConfirm.producto.id}`);

        setProductos(productos.filter(p => p.id !== deleteConfirm.producto!.id));
        success(`Producto "${deleteConfirm.producto.name}" eliminado exitosamente`);
        setDeleteConfirm({ isOpen: false });
      } catch (ex) {
        console.error(ex);
        error("Ocurrió un error al eliminar el producto.");
      }
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
      <AdminHeader
        title="Productos"
        description="Gestiona acompañamientos y bebidas"
        buttonText="Nuevo Producto"
        buttonIcon={<PlusIcon size={20} />}
        onButtonClick={openCreateModal}
      />

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

      {
        loading && (
          <div className='py-8 flex justify-center items-center text-center'>
            <SpinnerGapIcon className='w-10 h-10 animate-spin text-gray-500'/>
          </div>
        )
      }

      {/* Tabla de productos */
        !loading && (
          <ProductoTable
            productos={filteredProductos}
            onEdit={openEditModal}
            onDelete={openDeleteConfirm}
          />
        )
      }

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