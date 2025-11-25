'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export const Navbar = () => {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState('');
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    const handleAccountOpen = () => {
      setIsAccountOpen(true);
    };

    const handleAccountClose = () => {
      setIsAccountOpen(false);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('openAccount', handleAccountOpen as EventListener);
    window.addEventListener('closeAccount', handleAccountClose as EventListener);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('openAccount', handleAccountOpen as EventListener);
      window.removeEventListener('closeAccount', handleAccountClose as EventListener);
    };
  }, []);

  const navItems = [
    { label: 'Favoritos', href: '/', hash: '' },
    { label: 'Acompañamientos', href: '/#acompañamientos', hash: '#acompañamientos' },
    { label: 'Bebidas', href: '/#bebidas', hash: '#bebidas' },
  ];

  const isActive = (item: typeof navItems[0]) => {
    // Si AccountArea está abierto, nada está activo
    if (isAccountOpen) return false;

    if (pathname !== '/') return false;

    // Decode hash to handle special characters like ñ
    const decodedActiveHash = decodeURIComponent(activeHash);

    // Favoritos is active when there's no hash or hash is empty
    if (item.hash === '') {
      return activeHash === '' || activeHash === '#' || activeHash === '#favoritos';
    }

    // Compare decoded hashes
    return decodedActiveHash === item.hash;
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof navItems[0]) => {
    if (pathname === '/') {
      e.preventDefault();
      if (item.hash === '') {
        window.history.pushState(null, '', '/');
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      } else {
        window.location.hash = item.hash;
      }
    }
  };

  return (
    <>
      {/* Banner de estado */}
      <div className="bg-white border-b-2 border-primary-100 py-3 text-center">
        <p className="text-primary-600 font-semibold">
          ¡Crea tu hamburguesa o pizza perfecta a tu gusto!
        </p>
      </div>

      {/* Navbar sticky */}
      <nav className="bg-white shadow-md sticky top-0">
        <ul className="flex justify-center flex-wrap max-w-6xl mx-auto">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={(e) => handleClick(e, item)}
                className={`
                  block px-8 py-5 font-medium transition-all duration-300 border-b-3
                  ${isActive(item)
                    ? 'text-primary-600 border-primary-600 bg-primary-50'
                    : 'text-gray-700 border-transparent hover:text-primary-600 hover:bg-primary-50'
                  }
                `}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};