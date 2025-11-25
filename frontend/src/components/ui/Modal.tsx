'use client';

import { ReactNode, useEffect } from 'react';
import { XIcon } from '@/components/icons';
import { cn } from '@/lib/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    }

    // Cleanup function que siempre se ejecuta
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-3xl',
    xl: 'max-w-6xl',
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-center items-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className={cn(
          'bg-white w-full rounded-3xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden',
          sizes[size]
        )}
        onClick={(e) => e.stopPropagation()} // evita cerrar al hacer click dentro
      >
        {/* Header: título centrado visualmente, botón de cerrar a la derecha */}
        <div className="relative flex items-center px-6 py-4 border-b border-gray-200 rounded-t-3xl min-h-[68px]">
          <h3 className="text-2xl font-bold text-gray-900 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {title}
          </h3>

          <button
            onClick={onClose}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <XIcon size={24} />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 rounded-b-3xl scroll-gutter">
          {children}
        </div>
      </div>
    </div>
  );
};
