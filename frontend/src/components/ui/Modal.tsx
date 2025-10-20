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
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
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
      className="fixed inset-0 z-[100] flex justify-center items-center bg-black/50 p-4"
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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 rounded-t-3xl">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon size={24} />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 rounded-b-3xl">
          {children}
        </div>
      </div>
    </div>
  );
};
