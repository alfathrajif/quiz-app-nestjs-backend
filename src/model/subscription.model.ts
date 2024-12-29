export class Subscription {
  uuid: string;
  started_date: Date;
  end_date: Date;
  status: string;
  subscription_plan: SubscriptionPlan;
}

export class SubscriptionPlan {
  uuid: string;
  name: string;
  description: string;
  price: number;
  duration: string;
}

export class CreateSubscription {
  user_uuid: string;
  subscription_plan_uuid: string;
  started_date: Date;
  end_date: Date;
  status: string;
}
