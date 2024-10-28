import { Role } from './role.model';

export class User {
  uuid: string;
  email: string;
  name: string;
  role: Role;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export class UserResponse {
  uuid: string;
  email: string;
  name: string;
  role: Role;
}

export class CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export class CreateUserResponse {
  uuid: string;
  email: string;
  name: string;
}
