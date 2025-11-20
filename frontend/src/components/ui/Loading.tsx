import { SpinnerGapIcon } from '@phosphor-icons/react';

interface LoadingProps {
  size?: number;
  className?: string;
}

export const Loading = ({ size = 40, className = '' }: LoadingProps) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <SpinnerGapIcon
        className="animate-spin text-primary-600"
        size={size}
        weight="bold"
      />
    </div>
  );
};
