import { Module } from '@nestjs/common';
import { UsersUserService } from './users-user.service';
import { UsersUserController } from './users-user.controller';
import { SubscriptionPlansUserModule } from 'src/subscription-plans/user/subscription-plans-user.module';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';

@Module({
  imports: [SubscriptionPlansUserModule, SubscriptionsModule],
  controllers: [UsersUserController],
  providers: [UsersUserService],
  exports: [UsersUserService],
})
export class UsersUserModule {}
