'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import useAuth from '@/hooks/useAuth';
import { UserIcon, LockIcon } from '@/components/icons';

// Agregar LockIcon a los iconos si no existe
export const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: Conectar con el backend
      // const response = await authApi.login(formData);
      // localStorage.setItem('token', response.token);
      
      // Simulación temporal
  await login({ email: formData.email, password: formData.password });
      router.push('/');
    } catch (error) {
  setErrors({ submit: (error as Error).message || 'Error al iniciar sesión. Verifica tus credenciales.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        error={errors.password}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-600">Recordarme</span>
        </label>
        <Link href="/recuperar-password" className="text-sm text-primary-600 hover:text-primary-700">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.submit}
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
        Iniciar Sesión
      </Button>

      <p className="text-center text-gray-600">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
          Regístrate aquí
        </Link>
      </p>
    </form>
  );
};