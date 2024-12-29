import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { PlansModule } from './plans/plans.module';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  imports: [PlansModule],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
