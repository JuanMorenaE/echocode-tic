export interface Funcionario {
  userId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  document: string;
  address: object | null;
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
