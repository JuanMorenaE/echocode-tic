'use client';

import React, { JSX, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { Funcionario } from '@/types/employes.types';

export interface FuncionariosFormProps {
  funcionario?: Funcionario;
  onSubmit: (data: Funcionario) => Promise<void>;
  onCancel: () => void;
}

export default function FuncionariosForm({
  funcionario,
  onSubmit,
  onCancel,
}: FuncionariosFormProps): JSX.Element {
  const [form, setForm] = useState<Funcionario>(funcionario ?? {} as Funcionario);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.firstName ?? ''}
        onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
        placeholder="Nombre completo"
      />
       <input
        value={[form.document ?? '']}
        onChange={e => setForm(f => ({ ...f, document: e.target.value }))}
        placeholder="Cédula"
      />
       <input
        value={[form.email ?? '']}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        placeholder="Email"
      />
       <input
        value={[form.phoneNumber ?? '']}
        onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
        placeholder="Número de teléfono"
      />
       <input
        value={[form.address ?? '']}
        onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
        placeholder="Domicilio"
      />
      
      <div style={{ display: 'flex', gap: '50px' }}>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}


/**export const FuncionariosForm = ({ funcionario, onSubmit, onCancel }: FuncionariosFormProps) => {
  const [formData, setFormData] = useState({
    Nombre_completo: funcionario?.full_name || '',
    tipo: funcionario?.type || 'ADMINISTRADOR',
    fecha_ingreso: funcionario?.date_of_entry || '',
    imagen: '',
  })};/** */

  

