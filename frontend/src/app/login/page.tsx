import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { ArrowLeftIcon } from '@/components/icons';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Botón volver */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8 transition-colors"
        >
          <ArrowLeftIcon size={20} />
          Volver al inicio
        </Link>

        {/* Card de login */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <img 
              src="/Logo2.png" 
              alt="PizzUM & BurgUM" 
              className="h-16 mx-auto mb-2"
            />
            <h2 className="text-2xl font-semibold text-gray-800">
              Iniciar Sesión
            </h2>
            <p className="text-gray-600 mt-2">
              Accede a tu cuenta para hacer pedidos
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}