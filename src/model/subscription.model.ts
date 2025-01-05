import { SubscriptionPlan } from './subscription-plan';

export class Subscription {
  uuid: string;
  started_date: Date;
  end_date: Date;
  status: string;
  subscription_plan?: SubscriptionPlan;
}

export class CreateSubscription {
  user_uuid: string;
  subscription_plan_uuid: string;
  started_date: Date;
  end_date: Date;
  status: string;
}
