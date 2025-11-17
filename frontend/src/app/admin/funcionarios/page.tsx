'use client';

import { useEffect, useState } from 'react';
import { FuncionarioTable } from '@/components/admin/FuncionariosTable';
import { FuncionariosForm } from '@/components/admin/FuncionariosForm';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PlusIcon, MagnifyingGlassIcon } from '@/components/icons';
import { Funcionario, FuncionarioDto } from '@/types/employes.types';
import { useToast } from '@/context/ToastContext';
import { SpinnerGapIcon } from '@phosphor-icons/react';
import api from '@/lib/axios/interceptors';
import { getToken } from '@/lib/utils/auth';

export default function FuncionariosPage() {
  const { success, error } = useToast();

  const [loading, setLoading] = useState<boolean>(true);

  const [token, setToken] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resp = await api.get<FuncionarioDto[]>('/v1/administrator', {
          headers: {
            Authorization: "Bearer " + getToken(),
          }
        });
        const data = resp.data;

        console.log(data);
        setFuncionarios(data);
      } catch (ex) {
        console.error(ex)
        error("Ocurrio un error inesperado, contacta a un administrador.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])


  useEffect(() => {
    setToken(localStorage.getItem('token') ?? "")
  }, []);

  /**useEffect(() => {
    const fetchData = async () => {
      try{
        setLoading(true)
        const response = await fetch('http://localhost:8080/api/v1/products');
        const data: Funcionario[] = await response.json()
  
        console.log(data)
        setFuncionarios(data)
      }catch(ex){
        console.error(ex)
        error("Ocurrio un error inesperado, contacta a un administrador.")
      }finally{
        setLoading(false)
      }
    }

    fetchData()
  }, [])/** */

  const [funcionarios, setFuncionarios] = useState<FuncionarioDto[]>([
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<FuncionarioDto | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; funcionario?: FuncionarioDto }>({
    isOpen: false,
  });

    const handleCreateFuncionario = async (data: Funcionario) => {
      const { id, ...newFuncionario} = data;
  
      console.log(newFuncionario)
      
      try{
        const resp = await api.post('/v1/administrator/create', newFuncionario);
        const created = resp.data;
  
        setFuncionarios([...funcionarios, created]);
        setIsModalOpen(false);
        success(`Funcionario "${created.firstName}" creado exitosamente`);
      }catch(ex){
        console.error(ex)
        error("Ocurrio un error inesperado, contacta a un administrador.")
      }
    };

  /**const handleCreateFuncionario = async (data: Funcionario) => {
    const { id, ...newFuncionario} = data;

    console.log(newFuncionario)

    try{
      const response = await fetch('http://localhost:8080/api/v1/products', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(newFuncionario)
      });

      if (!response.ok) {
        throw new Error(`Error en la creación del funcionario (${response.status})`);
      } 

      const created = await response.json();

      setFuncionarios([...funcionarios, created]);
      setIsModalOpen(false);
      success(`Funcionario "${created.name}" creado exitosamente`);
    }catch(ex){
      console.error(ex)
      error("Ocurrio un error inesperado, contacta a un administrador.")
    }
  }/** */

  /**const handleEditFuncionario = async (data: Funcionario) => {
    setFuncionarios(funcionarios.map(f => 
      f.id === editingFuncionario?.id ? { ...f, ...data } : f
    ));
    setIsModalOpen(false);
    setEditingFuncionario(undefined);
    success(`Funcionario "${data.full_name}" actualizado exitosamente`);
  };/**
  
  */

  const handleEditFuncionario = async (data: Funcionario) => {
    try {
      const { id, ...updateData } = data;
      await api.put(`/v1/funcionarios/${id}`, updateData);

      // setFuncionarios(funcionarios.map(f =>
      //   f.id === id ? data : f
      // ));
      setIsModalOpen(false);
      setEditingFuncionario(undefined);
      success(`Funcionario "${data.firstName}" actualizado exitosamente`);
    } catch (ex) {
      console.error(ex);
      error("Ocurrió un error al actualizar el funcionario.");
    }
  };

  /**const openDeleteConfirm = (funcionario: Funcionario) => {
    setDeleteConfirm({ isOpen: true, funcionario });
  };

  const handleDeleteFuncionario = () => {
    if (deleteConfirm.funcionario) {
      setFuncionarios(funcionarios.filter(f => f.id !== deleteConfirm.funcionario!.id));
      success(`Funcionario "${deleteConfirm.funcionario.full_name}" eliminado exitosamente`);
      setDeleteConfirm({ isOpen: false });
    }
  };/** */

  const openDeleteConfirm = (funcionario: FuncionarioDto) => {
    setDeleteConfirm({ isOpen: true, funcionario });
  };

  const handleDeleteFuncionario = async () => {
    if (deleteConfirm.funcionario) {
      try {
        await api.delete(`/v1/funcionarios/${deleteConfirm.funcionario.id}`);

        setFuncionarios(funcionarios.filter(f => f.id !== deleteConfirm.funcionario!.id));
        success(`Funcionario "${deleteConfirm.funcionario.firstName}" eliminado exitosamente`);
        setDeleteConfirm({ isOpen: false });
      } catch (ex) {
        console.error(ex);
        error("Ocurrió un error al eliminar el funcionario.");
      }
    }
  };

  const openCreateModal = () => {
    setEditingFuncionario(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (funcionario: FuncionarioDto) => {
    setEditingFuncionario(funcionario);
    setIsModalOpen(true);
  };

  const filteredFuncionarios = funcionarios.filter(f =>
    f.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <AdminHeader
        title="Funcionarios"
        description="Agrega o elimina funcionarios del negocio"
        buttonText="Nuevo Funcionario"
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
            placeholder="Buscar funcionario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {
        loading && (
          <div className='py-8 flex justify-center items-center text-center'>
            <SpinnerGapIcon className='w-10 h-10 animate-spin text-gray-500' />
          </div>
        )
      }

      {/* Tabla de funcionarios */
        !loading && (
          <FuncionarioTable
            funcionarios={filteredFuncionarios}
            onEdit={openEditModal}
            onDelete={openDeleteConfirm}
          />
        )
      }

      {/* Modal de crear/editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFuncionario ? 'Editar Funcionario' : 'Nuevo Funcionario'}
        size="lg"
      >
        <FuncionariosForm
          funcionario={editingFuncionario as Funcionario | undefined}
          onSubmit={editingFuncionario ? handleEditFuncionario : handleCreateFuncionario}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Diálogo de confirmación de eliminación */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false })}
        onConfirm={handleDeleteFuncionario}
        title="¿Eliminar funcionario?"
        message={`Estás a punto de eliminar "${deleteConfirm.funcionario?.firstName}". Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}