import { Module } from '@nestjs/common';
import { AdministratorsService } from './administrators.service';
import { AdministratorsController } from './administrators.controller';
import { UsersUserModule } from 'src/users/user/users-user.module';
import { SubscriptionPlansUserModule } from 'src/subscription-plans/user/subscription-plans-user.module';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';

@Module({
  imports: [UsersUserModule, SubscriptionPlansUserModule, SubscriptionsModule],
  controllers: [AdministratorsController],
  providers: [AdministratorsService],
})
export class AdministratorsModule {}
