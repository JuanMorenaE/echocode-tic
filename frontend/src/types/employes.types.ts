export interface Funcionario {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  address: string;
  document: string;

  

  /**tipo?: string;
  badge?: {
    text: string;
    color: string;
  }; /**/
}

export interface FuncionarioDto {
  id: number;
  document: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

/**export type ProductCategory = 'hamburguesas' | 'pizzas' | 'acompañamientos' | 'bebidas';**/