'use client';

import { Button } from './Button';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger'
}: ConfirmDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getTypeStyles = () => {
    if (type === 'danger') {
      return {
        icon: '🗑️',
        iconBg: 'bg-red-100',
        confirmVariant: 'danger' as const
      };
    }
    if (type === 'warning') {
      return {
        icon: '⚠️',
        iconBg: 'bg-yellow-100',
        confirmVariant: 'primary' as const
      };
    }
    return {
      icon: 'ℹ️',
      iconBg: 'bg-blue-100',
      confirmVariant: 'primary' as const
    };
  };

  const styles = getTypeStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="text-center">
        {/* Icon */}
        <div className={`mx-auto w-16 h-16 ${styles.iconBg} rounded-full flex items-center justify-center mb-4`}>
          <span className="text-3xl">{styles.icon}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>

        {/* Message */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button variant="ghost" onClick={onClose} size="lg">
            {cancelText}
          </Button>
          <Button variant={styles.confirmVariant} onClick={handleConfirm} size="lg">
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};