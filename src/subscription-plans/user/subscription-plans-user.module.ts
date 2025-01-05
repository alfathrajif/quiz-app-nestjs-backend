import { Module } from '@nestjs/common';
import { SubscriptionPlansUserService } from './subscription-plans-user.service';
import { SubscriptionPlansUserController } from './subscription-plans-user.controller';

@Module({
  controllers: [SubscriptionPlansUserController],
  providers: [SubscriptionPlansUserService],
  exports: [SubscriptionPlansUserService],
})
export class SubscriptionPlansUserModule {}
