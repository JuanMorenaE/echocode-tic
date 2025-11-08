'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { UserIcon } from '@/components/icons';
import useAuth from '@/hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Callback cuando el login/registro es exitoso
  defaultTab?: 'login' | 'register';
}

export const AuthModal = ({ isOpen, onClose, onSuccess, defaultTab = 'login' }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const { login, register } = useAuth();

  // Login Form State
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Register Form State
  const [registerData, setRegisterData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    cedula: '',
    birthdate: '',
    password: '',
    confirmPassword: '',
  });
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  // Validación Login
  const validateLogin = () => {
    const newErrors: Record<string, string> = {};

    if (!loginData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!loginData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (loginData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setLoginErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validación Register
  const validateRegister = () => {
    const newErrors: Record<string, string> = {};

    if (!registerData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!registerData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }

    if (!registerData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!registerData.telefono) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{8,}$/.test(registerData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'Teléfono inválido (mínimo 8 dígitos)';
    }

    if (!registerData.cedula) {
      newErrors.cedula = 'La cédula es requerida';
    } else if (!/^\d{6,}$/.test(registerData.cedula.replace(/\s/g, ''))) {
      newErrors.cedula = 'Cédula inválida (mínimo 6 dígitos)';
    }

    if (!registerData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (registerData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setRegisterErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateLogin()) return;

    setIsLoginLoading(true);

    try {
      await login({ email: loginData.email, password: loginData.password });

      // Esperar un momento para que el localStorage se actualice
      await new Promise(resolve => setTimeout(resolve, 100));

      // Resetear formulario
      setLoginData({ email: '', password: '' });
      setLoginErrors({});

      // Ejecutar callback de éxito
      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      setLoginErrors({ submit: (error as Error).message || 'Error al iniciar sesión. Verifica tus credenciales.' });
    } finally {
      setIsLoginLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRegister()) return;

    setIsRegisterLoading(true);

    try {
      await register({
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.nombre,
        lastName: registerData.apellido,
        phoneNumber: registerData.telefono,
        cedula: registerData.cedula,
        birthdate: registerData.birthdate || null,
      });

      // Resetear formulario
      setRegisterData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        cedula: '',
        birthdate: '',
        password: '',
        confirmPassword: '',
      });
      setRegisterErrors({});

      // Ejecutar callback de éxito
      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      setRegisterErrors({ submit: (error as Error).message || 'Error al registrarse. Intenta nuevamente.' });
    } finally {
      setIsRegisterLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
      size="md"
    >
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('login')}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            activeTab === 'login'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            activeTab === 'register'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Registrarse
        </button>
      </div>

      {/* Login Form */}
      {activeTab === 'login' && (
        <form onSubmit={handleLoginSubmit} className="space-y-6 px-6 pb-6">
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            error={loginErrors.email}
            icon={<UserIcon size={20} />}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            error={loginErrors.password}
          />

          {loginErrors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {loginErrors.submit}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" isLoading={isLoginLoading}>
            Iniciar Sesión
          </Button>

          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Regístrate aquí
            </button>
          </p>
        </form>
      )}

      {/* Register Form */}
      {activeTab === 'register' && (
        <form onSubmit={handleRegisterSubmit} className="space-y-5 px-6 pb-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              placeholder="Juan"
              value={registerData.nombre}
              onChange={(e) => setRegisterData({ ...registerData, nombre: e.target.value })}
              error={registerErrors.nombre}
            />

            <Input
              label="Apellido"
              placeholder="Pérez"
              value={registerData.apellido}
              onChange={(e) => setRegisterData({ ...registerData, apellido: e.target.value })}
              error={registerErrors.apellido}
            />

            <Input
              label="Cédula"
              placeholder="12345678"
              value={registerData.cedula}
              onChange={(e) => setRegisterData({ ...registerData, cedula: e.target.value })}
              error={registerErrors.cedula}
            />

            <Input
              label="Fecha de nacimiento"
              type="date"
              value={registerData.birthdate}
              onChange={(e) => setRegisterData({ ...registerData, birthdate: e.target.value })}
              error={registerErrors.birthdate}
            />
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            error={registerErrors.email}
            icon={<UserIcon size={20} />}
          />

          <Input
            label="Teléfono"
            type="tel"
            placeholder="099 123 456"
            value={registerData.telefono}
            onChange={(e) => setRegisterData({ ...registerData, telefono: e.target.value })}
            error={registerErrors.telefono}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            error={registerErrors.password}
          />

          <Input
            label="Confirmar Contraseña"
            type="password"
            placeholder="••••••••"
            value={registerData.confirmPassword}
            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
            error={registerErrors.confirmPassword}
          />

          {registerErrors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {registerErrors.submit}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" isLoading={isRegisterLoading}>
            Crear Cuenta
          </Button>

          <p className="text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Inicia sesión aquí
            </button>
          </p>
        </form>
      )}
    </Modal>
  );
};
