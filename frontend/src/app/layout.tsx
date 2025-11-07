import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/lib/react-query/QueryProvider';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import CartModal from '@/components/layout/CartModal';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PizzUM & BurgUM',
  description: 'Crea tus pizzas y hamburguesas personalizadas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <QueryProvider>
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                {children}
                <CartModal />
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}