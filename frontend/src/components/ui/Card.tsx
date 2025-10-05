'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export const Card = ({ children, className, onClick, style }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl p-5 shadow-md transition-all duration-300',
        onClick && 'cursor-pointer hover:shadow-xl hover:-translate-y-2',
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

interface ProductCardProps {
  name: string;
  price: number;
  description: string;
  icon: ReactNode;
  badge?: {
    text: string;
    color: string;
  };
  animationDelay?: number;
}

export const ProductCard = ({ 
  name, 
  price, 
  description, 
  icon, 
  badge,
  animationDelay = 0 
}: ProductCardProps) => {
  return (
    <Card 
      className="animate-fade-in"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Imagen/Icono */}
      <div className="w-full h-48 bg-gradient-to-br from-primary-200 to-primary-100 rounded-xl mb-4 flex items-center justify-center">
        {icon}
      </div>

      {/* Header con nombre y precio */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        <span className="text-xl font-bold text-primary-600">${price}</span>
      </div>

      {/* Descripción */}
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {description}
      </p>

      {/* Badge opcional */}
      {badge && (
        <span className={`inline-block ${badge.color} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
          {badge.text}
        </span>
      )}
    </Card>
  );
};