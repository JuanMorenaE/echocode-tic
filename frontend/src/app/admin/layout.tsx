'use client';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state, isLoading } = useAuth();
  const router = useRouter();

  // Debug logs (comentados - descomentar si necesitas depurar)
  // console.log('AdminLayout - isLoading:', isLoading);
  // console.log('AdminLayout - state:', state);
  // console.log('AdminLayout - token:', state?.token);
  // console.log('AdminLayout - role:', state?.user?.role);

  useEffect(() => {
    // No verificar permisos hasta que termine de cargar
    if (isLoading) {
      // console.log('AdminLayout - Todavía cargando, esperando...');
      return;
    }

    // console.log('AdminLayout useEffect - Verificando permisos...');

    // Verificar si el usuario está autenticado
    if (!state?.token) {
      // console.log('AdminLayout - No hay token, redirigiendo a /login');
      router.push('/login');
      return;
    }

    // Verificar si el usuario es admin
    const payload = JSON.parse(atob(state.token.split(".")[1]));
    if (payload.role !== 'ADMIN') {
      // console.log('AdminLayout - No es ADMIN (role:', state?.user?.role, '), redirigiendo a /');
      router.push('/');
      return;
    }

    // console.log('AdminLayout - Usuario es ADMIN, mostrando panel');
  }, [state, router, isLoading]);

  // Mientras está cargando o no tiene permisos, mostrar loading
  if (isLoading || !state?.token || state?.user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}