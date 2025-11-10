import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex md:flex-row justify-center items-center">
          <p className="text-gray-600 text-sm text-center">
            © 2025 PizzUM & BurgUM. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};