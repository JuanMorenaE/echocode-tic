'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { UserIcon } from '@/components/icons';
import useAuth from '@/hooks/useAuth';

export const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
  telefono: '',
  cedula: '',
  birthdate: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefono) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{8,}$/.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'Teléfono inválido (mínimo 8 dígitos)';
    }

    if (!formData.cedula) {
      newErrors.cedula = 'La cédula es requerida';
    } else if (!/^\d{6,}$/.test(formData.cedula.replace(/\s/g, ''))) {
      newErrors.cedula = 'Cédula inválida (mínimo 6 dígitos)';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.nombre,
        lastName: formData.apellido,
        phoneNumber: formData.telefono,
        cedula: formData.cedula,
        birthdate: formData.birthdate || null,
      });
      router.push('/');
    } catch (error) {
      setErrors({ submit: (error as Error).message || 'Error al registrarse. Intenta nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Nombre"
          placeholder="Juan"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          error={errors.nombre}
        />

        <Input
          label="Apellido"
          placeholder="Pérez"
          value={formData.apellido}
          onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
          error={errors.apellido}
        />
        
        <Input
          label="Cédula"
          placeholder="12345678"
          value={formData.cedula}
          onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
          error={errors.cedula}
        />

        <Input
          label="Fecha de nacimiento"
          type="date"
          value={formData.birthdate}
          onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
          error={errors.birthdate}
        />
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="tu@email.com"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        icon={<UserIcon size={20} />}
      />

      <Input
        label="Teléfono"
        type="tel"
        placeholder="099 123 456"
        value={formData.telefono}
        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
        error={errors.telefono}
      />

      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        error={errors.password}
      />

      <Input
        label="Confirmar Contraseña"
        type="password"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        error={errors.confirmPassword}
      />

      <div className="flex items-start">
        <input
          type="checkbox"
          required
          className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label className="ml-2 text-sm text-gray-600">
          Acepto los{' '}
          <Link href="#" className="text-primary-600 hover:text-primary-700">
            términos y condiciones
          </Link>{' '}
          y la{' '}
          <Link href="#" className="text-primary-600 hover:text-primary-700">
            política de privacidad
          </Link>
        </label>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.submit}
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
        Crear Cuenta
      </Button>

      <p className="text-center text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
          Inicia sesión aquí
        </Link>
      </p>
    </form>
  );
};