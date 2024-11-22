import { PaymentRequest } from './payment.model';
import { Role } from './role.model';
import { Subscription } from './subscription.model';

export class User {
  uuid: string;
  email: string;
  name: string;
  role: Role;
  phone?: string;
  subscription?: Subscription;
  payment_requests: PaymentRequest[];
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

export class ProfileResponse {
  uuid: string;
  email: string;
  phone: string;
  name: string;
  role: Role;
  subscription?: Subscription;
  payment_requests?: PaymentRequest[];
}

export class CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
}

export class CreateUserResponse {
  uuid: string;
  email: string;
  name: string;
}
