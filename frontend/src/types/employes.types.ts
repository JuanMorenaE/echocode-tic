export interface Funcionario {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  exist?: boolean;
  residence: string;

  

  /**tipo?: string;
  badge?: {
    text: string;
    color: string;
  }; /**/
}

/**export type ProductCategory = 'hamburguesas' | 'pizzas' | 'acompañamientos' | 'bebidas';**/