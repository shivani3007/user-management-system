import { Role } from 'src/roles/interfaces/role.interface';

export interface User {
  sub?: number;
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
  createdAt?: Date;
  updatedAt?: Date;
}
