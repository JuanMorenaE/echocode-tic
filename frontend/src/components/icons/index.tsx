'use client';

import React from 'react';
import {
  ShoppingCart,
  User,
  UserCircle,
  ShoppingBag,
  SignOut,
  Pizza,
  Hamburger,
  Heart,
  Plus,
  Minus,
  Trash,
  Check,
  X,
  List,
  MagnifyingGlass,
  CaretDown,
  Package,
  Clock,
  MapPin,
  CreditCard,
  Star,
  Eye,
  EyeSlash,
  SignIn,
  UserPlus,
  Gear,
  ChartBar,
  Users,
  FileText,
  PencilSimple,
  ArrowLeft,
  ArrowRight,
  House,
  Storefront,
  Truck,
  CheckCircle,
  XCircle,
  Info,
  Lock,
  ClipboardText,
  TagChevron,
  Calendar,
  Funnel
} from '@phosphor-icons/react';

interface IconProps {
  size?: number;
  className?: string;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
}

export const defaultTailwindCSS = "my-auto flex flex-shrink-0";
export const defaultTailwindCSSPrimary = "my-auto flex flex-shrink-0 text-primary-600";

// Iconos de navegación y acciones
export const ShoppingCartIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <ShoppingCart size={size} className={className} weight={weight} />;
};

export const UserIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <User size={size} className={className} weight={weight} />;
};

export const UserCircleIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <UserCircle size={size} className={className} weight={weight} />;
};

export const ShoppingBagIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <ShoppingBag size={size} className={className} weight={weight} />;
};

export const SignOutIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <SignOut size={size} className={className} weight={weight} />;
};

export const SignInIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <SignIn size={size} className={className} weight={weight} />;
};

export const UserPlusIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <UserPlus size={size} className={className} weight={weight} />;
};

// Iconos de productos
export const PizzaIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <Pizza size={size} className={className} weight={weight} />;
};

export const HamburgerIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <Hamburger size={size} className={className} weight={weight} />;
};

// Iconos de acciones
export const HeartIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <Heart size={size} className={className} weight={weight} />;
};

export const PlusIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <Plus size={size} className={className} weight={weight} />;
};

export const MinusIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <Minus size={size} className={className} weight={weight} />;
};

export const TrashIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <Trash size={size} className={className} weight={weight} />;
};

export const CheckIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <Check size={size} className={className} weight={weight} />;
};

export const XIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <X size={size} className={className} weight={weight} />;
};

export const CheckCircleIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <CheckCircle size={size} className={className} weight={weight} />;
};

export const XCircleIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <XCircle size={size} className={className} weight={weight} />;
};

// Iconos de interfaz
export const ListIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <List size={size} className={className} weight={weight} />;
};

export const MagnifyingGlassIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <MagnifyingGlass size={size} className={className} weight={weight} />;
};

export const CaretDownIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <CaretDown size={size} className={className} weight={weight} />;
};

export const EyeIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <Eye size={size} className={className} weight={weight} />;
};

export const EyeSlashIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <EyeSlash size={size} className={className} weight={weight} />;
};

// Iconos de pedidos y entregas
export const PackageIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <Package size={size} className={className} weight={weight} />;
};

export const ClockIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <Clock size={size} className={className} weight={weight} />;
};

export const TruckIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <Truck size={size} className={className} weight={weight} />;
};

// Iconos de ubicación y pago
export const MapPinIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <MapPin size={size} className={className} weight={weight} />;
};

export const CreditCardIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <CreditCard size={size} className={className} weight={weight} />;
};

export const StarIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <Star size={size} className={className} weight={weight} />;
};

// Iconos de navegación
export const HouseIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <House size={size} className={className} weight={weight} />;
};

export const StorefrontIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <Storefront size={size} className={className} weight={weight} />;
};

export const ArrowLeftIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <ArrowLeft size={size} className={className} weight={weight} />;
};

export const ArrowRightIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <ArrowRight size={size} className={className} weight={weight} />;
};

// Iconos de admin
export const GearIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <Gear size={size} className={className} weight={weight} />;
};

export const ChartBarIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <ChartBar size={size} className={className} weight={weight} />;
};

export const UsersIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <Users size={size} className={className} weight={weight} />;
};

export const FileTextIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <FileText size={size} className={className} weight={weight} />;
};

export const PencilSimpleIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <PencilSimple size={size} className={className} weight={weight} />;
};

export const InfoIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <Info size={size} className={className} weight={weight} />;
};

export const LockIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <Lock size={size} className={className} weight={weight} />;
};

export const ClipboardTextIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <ClipboardText size={size} className={className} weight={weight} />;
};

export const TagChevronIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <TagChevron size={size} className={className} weight={weight} />;
};

export const CalendarIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <Calendar size={size} className={className} weight={weight} />;
};

export const FunnelIcon = ({
  size = 24,
  className = defaultTailwindCSS,
  weight = 'regular',
}: IconProps) => {
  return <Funnel size={size} className={className} weight={weight} />;
};