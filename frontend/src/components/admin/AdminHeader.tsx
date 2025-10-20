'use client';

import { Button } from '@/components/ui/Button';

interface AdminHeaderProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  onButtonClick?: () => void;
}

export const AdminHeader = ({
  title,
  description,
  buttonText,
  buttonIcon,
  onButtonClick,
}: AdminHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>
      {buttonText && onButtonClick && (
        <Button onClick={onButtonClick} className="flex items-center gap-2">
          {buttonIcon}
          {buttonText}
        </Button>
      )}
    </div>
  );
};
