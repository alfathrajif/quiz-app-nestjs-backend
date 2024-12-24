import { SubscriptionPlan } from './subscription.model';

export class CreatePaymentRequest {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  notes?: string;
  amount: number;
  subscription_plan_uuid: string;
}

export class UpdatePaymentRequest {
  status: string; // pending, paid, expired, cancelled
}

export class PaymentRequest {
  uuid: string;
  user_uuid: string;
  subscription_plan_uuid: string;
  subscription_plan?: SubscriptionPlan;
  amount: number;
  request_date: Date;
  due_date: Date;
  status: string; // pending, paid, expired, cancelled
  notes?: string;
}

export class CreatePaymentReceipt {
  payment_request_uuid: string;
  upload_date: Date;
  payment_date: Date;
  payment_proof_image: string;
  amount_paid: number;
  status: string; // submitted, approved, rejected
}

export class PaymentReceipt {
  uuid: string;
  payment_request_uuid: string;
  payment_request?: PaymentRequest;
  upload_date: Date;
  payment_date: Date;
  amount_paid: number;
  payment_proof_image: string;
  status: string; // submitted, approved, rejected
  reviewed_by_uuid?: string;
}

export class PaymentVerification extends PaymentReceipt {
  verified_by?: {
    name: string;
    email: string;
  };
  verification_date: Date;
  status: string; // approved, rejected
  remarks?: string;
}

export class CreatePaymentLog {
  user_uuid: string;
  amount: number;
  payment_date: Date;
  subscription_uuid?: string;
}

export class PaymentLog {
  uuid: string;
  user_uuid: string;
  amount: number;
  payment_date: Date;
  subscription_uuid?: string;
  created_at: Date;
  updated_at: Date;
}
