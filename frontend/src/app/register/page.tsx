import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ArrowLeftIcon } from '@/components/icons';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Botón volver */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8 transition-colors"
        >
          <ArrowLeftIcon size={20} />
          Volver al inicio
        </Link>

        {/* Card de registro */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <img 
              src="/Logo2.png" 
              alt="PizzUM & BurgUM" 
              className="h-16 mx-auto mb-2"
            />
            <h2 className="text-2xl font-semibold text-gray-800">
              Crear Cuenta
            </h2>
            <p className="text-gray-600 mt-2">
              Regístrate para empezar a disfrutar
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}