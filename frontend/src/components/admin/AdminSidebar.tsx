'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
  ChartBarIcon,
  PizzaIcon,
  PackageIcon,
  UsersIcon,
  FileTextIcon,
  HouseIcon,
  SignOutIcon,
  StorefrontIcon
} from '@/components/icons';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: ChartBarIcon,
  },
  {
    name: 'Productos',
    href: '/admin/productos',
    icon: PizzaIcon,
  },
  {
    name: 'Ingredientes',
    href: '/admin/ingredientes',
    icon: StorefrontIcon,
  },
  {
    name: 'Pedidos',
    href: '/admin/pedidos',
    icon: PackageIcon,
  },
  {
    name: 'Funcionarios',
    href: '/admin/funcionarios',
    icon: UsersIcon,
  },
  {
    name: 'Reportes',
    href: '/admin/reportes',
    icon: FileTextIcon,
  },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col sticky z-10 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/">
          <img 
            src="/Logo2.png" 
            alt="PizzUM & BurgUM" 
            className="h-12 cursor-pointer hover:opacity-80 transition-opacity"
        />
        </Link>
        <p className="text-sm text-gray-600 mt-1">Panel de Administración</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <HouseIcon size={20} />
          <span className="font-medium">Ir al sitio</span>
        </Link>
        <button
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
        >
          <SignOutIcon size={20} />
          <span className="font-medium">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};