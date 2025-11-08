'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { StarIcon } from '@/components/icons';

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
  onAddToCart?: () => void;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onCardClick?: () => void;
}

export const ProductCard = ({
  name,
  price,
  description,
  icon,
  badge,
  animationDelay = 0,
  onAddToCart,
  isFavorite = false,
  onFavoriteToggle,
  onCardClick
}: ProductCardProps) => {
  return (
    <Card
      className="animate-fade-in flex flex-col relative"
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={onCardClick}
    >
      {/* Estrella de favorito */}
      {onFavoriteToggle && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle();
          }}
          className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110"
          title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <StarIcon
            size={24}
            weight={isFavorite ? 'fill' : 'regular'}
            className={isFavorite ? 'text-yellow-500' : 'text-gray-400'}
          />
        </button>
      )}

      {/* Imagen/Icono */}
      <div className="w-full h-48 bg-gradient-to-br from-primary-200 to-primary-100 rounded-xl mb-4 flex items-center justify-center">
        {icon}
      </div>

      {/* Header con nombre y precio */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        <span className="text-xl font-bold text-gray-700">${price}</span>
      </div>

      {/* Descripción */}
      <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-1">
        {description}
      </p>

      {/* Badge opcional */}
      {badge && (
        <span className={`inline-block ${badge.color} text-white px-3 py-1 rounded-full text-xs font-semibold mb-3`}>
          {badge.text}
        </span>
      )}

      {/* Botón Agregar al Carrito */}
      {onAddToCart && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
        >
          Agregar al Carrito
        </button>
      )}
    </Card>
  );
};