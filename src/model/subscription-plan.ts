import { PaymentRequest } from './payment.model';
import { Subscription } from './subscription.model';

export class SubscriptionPlan {
  uuid: string;
  name: string;
  description: string;
  price: number;
  duration: string;
}

export class SubscriptionPlanAdmin extends SubscriptionPlan {
  subscriptions: Subscription[];
  payment_requests: PaymentRequest[];
  created_at: Date;
  updated_at: Date;
}

export class CreateSubscriptionPlan {
  name: string;
  description: string;
  price: number;
  duration: string;
}
