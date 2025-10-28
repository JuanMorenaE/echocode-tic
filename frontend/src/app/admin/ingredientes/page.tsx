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

export default function IngredientesPage() {
  const { success, error } = useToast();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try{
        setLoading(true)
        const response = await fetch('http://localhost:8080/api/v1/ingredients');
        const data: Ingrediente[] = await response.json()
  
        console.log(data)
        setIngredientes(data)
      }catch(ex){
        console.error(ex)
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

  const handleCreateIngrediente = (data: Partial<Ingrediente>) => {
    console.log(data)
    const newIngrediente: Ingrediente = {
      ...data,
    } as Ingrediente;
    
    const fetchData = async () => {
      try{
        console.log(JSON.stringify(newIngrediente))
        const response = await fetch('http://localhost:8080/api/v1/ingredients', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(newIngrediente)
        });
  
        const data: Ingrediente = await response.json()
  
        newIngrediente.id = data.id
      }catch(ex){
        console.error(ex)
      }
      
    }

    fetchData()

    setIngredientes([...ingredientes, newIngrediente]);
    setIsModalOpen(false);
    success(`Ingrediente "${data.name}" creado exitosamente`);
  };

  const handleEditIngrediente = (data: Partial<Ingrediente>) => {
    setIngredientes(ingredientes.map(i =>
      i.id === editingIngrediente?.id ? { ...i, ...data } : i
    ));
    setIsModalOpen(false);
    setEditingIngrediente(undefined);
    success(`Ingrediente "${data.name}" actualizado exitosamente`);
  };

  const openDeleteConfirm = (ingrediente: Ingrediente) => {
    setDeleteConfirm({ isOpen: true, ingrediente });
  };

  const handleDeleteIngrediente = () => {
    if (deleteConfirm.ingrediente) {
      setIngredientes(ingredientes.filter(i => i.id !== deleteConfirm.ingrediente!.id));
      success(`Ingrediente "${deleteConfirm.ingrediente.name}" eliminado exitosamente`);
      setDeleteConfirm({ isOpen: false });
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

  return (
    <div className="p-8">
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
