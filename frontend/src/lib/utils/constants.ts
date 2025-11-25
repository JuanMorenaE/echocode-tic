export const APP_NAME = 'PizzUM & BurgUM';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CREAR_PIZZA: '/crear-pizza',
  CREAR_HAMBURGUESA: '/crear-hamburguesa',
  FAVORITOS: '/favoritos',
  CARRITO: '/carrito',
  CHECKOUT: '/checkout',
  MIS_PEDIDOS: '/mis-pedidos',
  PERFIL: '/perfil',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    PRODUCTOS: '/admin/productos',
    PEDIDOS: '/admin/pedidos',
    FUNCIONARIOS: '/admin/funcionarios',
    REPORTES: '/admin/reportes',
  },
} as const;

export const ESTADOS_PEDIDO = {
  EN_COLA: 'EN_COLA',
  EN_PREPARACION: 'EN_PREPARACION',
  EN_CAMINO: 'EN_CAMINO',
  ENTREGADO: 'ENTREGADO',
  CANCELADO: 'CANCELADO',
} as const;

export const ESTADOS_PEDIDO_LABELS = {
  EN_COLA: 'En Cola',
  EN_PREPARACION: 'En Preparación',
  EN_CAMINO: 'En Camino',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
};

export const TIPO_COMPONENTE_PIZZA = {
  TAMAÑO: 'TAMAÑO',
  MASA: 'MASA',
  SALSA: 'SALSA',
  QUESO: 'QUESO',
  TOPPING: 'TOPPING',
} as const;

export const TIPO_COMPONENTE_HAMBURGUESA = {
  CARNE: 'CARNE',
  PAN: 'PAN',
  TOPPING: 'TOPPING',
  ADEREZO: 'ADEREZO',
} as const;

export const MAX_CARNES_HAMBURGUESA = 3;