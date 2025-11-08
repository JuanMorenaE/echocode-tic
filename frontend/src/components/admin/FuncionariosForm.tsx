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
        value={form.full_name ?? ''}
        onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
        placeholder="Nombre completo"
      />
      <input
        value={[form.date_of_entry ?? '']}
        onChange={e => setForm(f => ({ ...f, date_of_entry: e.target.value }))}
        placeholder="Fecha de ingreso"
      />
       <input
        value={[form.role ?? '']}
        onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
        placeholder="Rol"
      />
       <input
        value={[form.email ?? '']}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        placeholder="Email"
      />
       <input
        value={[form.phone_number ?? '']}
        onChange={e => setForm(f => ({ ...f, phone_number: e.target.value }))}
        placeholder="Número de teléfono"
      />
       <input
        value={[form.residence ?? '']}
        onChange={e => setForm(f => ({ ...f, residence: e.target.value }))}
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

  

