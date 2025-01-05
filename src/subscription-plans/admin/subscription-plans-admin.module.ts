import { Module } from '@nestjs/common';
import { SubscriptionPlansAdminService } from './subscription-plans-admin.service';
import { SubscriptionPlansAdminController } from './subscription-plans-admin.controller';

@Module({
  controllers: [SubscriptionPlansAdminController],
  providers: [SubscriptionPlansAdminService],
})
export class SubscriptionPlansAdminModule {}
