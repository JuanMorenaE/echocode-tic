export interface Funcionario {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  document: string;
  address: string;
}

export interface FuncionarioDto {
  id: number;
  document: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  createdAt?: string;
}
