import { Module } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { ReceiptsController } from './receipts.controller';
import { RequestsModule } from '../requests/requests.module';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';
import { SubscriptionPlansUserModule } from 'src/subscription-plans/user/subscription-plans-user.module';

@Module({
  imports: [RequestsModule, SubscriptionsModule, SubscriptionPlansUserModule],
  controllers: [ReceiptsController],
  providers: [ReceiptsService],
})
export class ReceiptsModule {}
