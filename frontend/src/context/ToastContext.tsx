'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircleIcon, XCircleIcon, XIcon } from '@/components/icons';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const success = (message: string) => showToast(message, 'success');
  const error = (message: string) => showToast(message, 'error');
  const info = (message: string) => showToast(message, 'info');

  const getToastStyles = (type: ToastType) => {
    const styles = {
      success: {
        bg: 'bg-green-600',
        icon: <CheckCircleIcon size={24} weight="fill" className="text-white" />
      },
      error: {
        bg: 'bg-red-600',
        icon: <XCircleIcon size={24} weight="fill" className="text-white" />
      },
      info: {
        bg: 'bg-blue-600',
        icon: <XCircleIcon size={24} weight="fill" className="text-white" />
      },
      warning: {
        bg: 'bg-yellow-600',
        icon: <XCircleIcon size={24} weight="fill" className="text-white" />
      }
    };
    return styles[type];
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      
      {/* Toast Container - ARRIBA A LA DERECHA */}
      <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-md pointer-events-none">
        {toasts.map((toast) => {
          const style = getToastStyles(toast.type);
          return (
            <div
              key={toast.id}
              className={`
                ${style.bg}
                text-white
                rounded-lg shadow-2xl p-4 
                flex items-start gap-3
                pointer-events-auto
                animate-slide-in
                min-w-[300px]
              `}
            >
              <div className="flex-shrink-0">
                {style.icon}
              </div>
              <p className="flex-1 font-medium text-white">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-white hover:opacity-70 transition-opacity"
              >
                <XIcon size={20} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};