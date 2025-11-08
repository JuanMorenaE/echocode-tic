export interface Funcionario {
  id: number;
  digital_id: number;
  full_name: string;
  phone_number: string;
  date_of_birth: Date;
  email: string;
  password: string;
  role: string;
  date_of_entry: string;
  exist?: boolean;
  residence: string;

  

  /**tipo?: string;
  badge?: {
    text: string;
    color: string;
  }; /**/
}

/**export type ProductCategory = 'hamburguesas' | 'pizzas' | 'acompañamientos' | 'bebidas';**/