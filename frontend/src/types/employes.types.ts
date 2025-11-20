export interface Funcionario {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  document: string;
}

export interface FuncionarioDto {
  userId: number;
  document: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  createdAt?: string;
}
