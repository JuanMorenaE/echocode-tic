import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © 2025 PizzUM & BurgUM. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
              Términos y Condiciones
            </Link>
            <Link href="#" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
              Política de Privacidad
            </Link>
            <Link href="#" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};