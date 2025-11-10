'use client';

import { useEffect, useState } from 'react';
import { IngredienteTable } from '@/components/admin/IngredienteTable';
import { IngredienteForm } from '@/components/admin/IngredienteForm';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PlusIcon, MagnifyingGlassIcon } from '@/components/icons';
import { Ingrediente } from '@/types/ingrediente.types';
import { useToast } from '@/context/ToastContext';
import { SpinnerGapIcon } from '@phosphor-icons/react';
import api from '@/lib/axios/axiosConfig';

export default function IngredientesPage() {
  const { success, error } = useToast();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try{
        setLoading(true)
        const resp = await api.get<Ingrediente[]>('/v1/ingredients');
        const data = resp.data;

        console.log(data);
        setIngredientes(data);
      }catch(ex){
        console.error(ex)
        error("Ocurrio un error inesperado, contacta a un administrador.")
      }finally{
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIngrediente, setEditingIngrediente] = useState<Ingrediente | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<'ALL' | 'PIZZA' | 'BURGER'>('ALL');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; ingrediente?: Ingrediente }>({
    isOpen: false,
  });

  const handleCreateIngrediente = async (data: Ingrediente) => {
    const { id, ...newIngrediente} = data;
    
    try{
  const resp = await api.post('/v1/ingredients', newIngrediente);
  const created = resp.data;

      setIngredientes([...ingredientes, created]);
      setIsModalOpen(false);
      success(`Ingrediente "${created.name}" creado exitosamente`);
    }catch(ex){
      console.error(ex)
      error("Ocurrio un error inesperado, contacta a un administrador.")
    }
  };

  const handleEditIngrediente = async (data: Ingrediente) => {
    try{
      const { id, ...updateData } = data;
      const resp = await api.put(`/v1/ingredients/${id}`, updateData);
      const updated = resp.data;

      setIngredientes((prev) =>
        prev.map((i) => (i.id === updated.id ? updated : i))
      );

      setIsModalOpen(false);
      setEditingIngrediente(undefined);
      success(`Ingrediente "${updated.name}" actualizado exitosamente`);
    }catch(ex){
      console.error(ex)
      error("Ocurrió un error al actualizar el ingrediente.")
    }
  };

  const openDeleteConfirm = (ingrediente: Ingrediente) => {
    setDeleteConfirm({ isOpen: true, ingrediente });
  };

  const handleDeleteIngrediente = async () => {
    if (deleteConfirm.ingrediente) {
      try {
        await api.delete(`/v1/ingredients/${deleteConfirm.ingrediente.id}`);

        setIngredientes(ingredientes.filter(i => i.id !== deleteConfirm.ingrediente!.id));
        success(`Ingrediente "${deleteConfirm.ingrediente.name}" eliminado exitosamente`);
        setDeleteConfirm({ isOpen: false });
      } catch (ex) {
        console.error(ex);
        error("Ocurrió un error al eliminar el ingrediente.");
      }
    }
  };

  const openCreateModal = () => {
    setEditingIngrediente(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (ingrediente: Ingrediente) => {
    setEditingIngrediente(ingrediente);
    setIsModalOpen(true);
  };

  const filteredIngredientes = ingredientes.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          i.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === 'ALL' || i.type === filterTipo;
    return matchesSearch && matchesTipo;
  });

  useEffect(() => {
    console.log("ingredientes:", ingredientes);
    console.log("tipo:", typeof ingredientes);
  }, [])

  return (
    <div className="p-8 flex flex-col max-h-screen">
      <AdminHeader
        title="Ingredientes"
        description="Gestiona los ingredientes para pizzas y hamburguesas"
        buttonText="Nuevo Ingrediente"
        buttonIcon={<PlusIcon size={20} />}
        onButtonClick={openCreateModal}
      />

      {/* Barra de búsqueda y filtros */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <MagnifyingGlassIcon size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar ingredientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterTipo('ALL')}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              filterTipo === 'ALL'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterTipo('PIZZA')}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              filterTipo === 'PIZZA'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Pizza
          </button>
          <button
            onClick={() => setFilterTipo('BURGER')}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              filterTipo === 'BURGER'
                ? 'bg-primary-600 border-red-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Hamburguesa
          </button>
        </div>
      </div>

      {
        loading && (
          <div className='py-8 flex justify-center items-center text-center'>
            <SpinnerGapIcon className='w-10 h-10 animate-spin text-gray-500'/>
          </div>
        )
      }

      {
        !loading && (
          <IngredienteTable
            ingredientes={filteredIngredientes}
            onEdit={openEditModal}
            onDelete={openDeleteConfirm}
          />
        )
      }
      

      {/* Modal de crear/editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIngrediente ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
        size="lg"
      >
        <IngredienteForm
          ingrediente={editingIngrediente}
          onSubmit={editingIngrediente ? handleEditIngrediente : handleCreateIngrediente}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Diálogo de confirmación de eliminación */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false })}
        onConfirm={handleDeleteIngrediente}
        title="¿Eliminar ingrediente?"
        message={`Estás a punto de eliminar "${deleteConfirm.ingrediente?.name}". Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}
