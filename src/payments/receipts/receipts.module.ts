import { Module } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { ReceiptsController } from './receipts.controller';
import { RequestsModule } from '../requests/requests.module';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';
import { PlansModule } from 'src/subscriptions/plans/plans.module';

@Module({
  imports: [RequestsModule, SubscriptionsModule, PlansModule],
  controllers: [ReceiptsController],
  providers: [ReceiptsService],
})
export class ReceiptsModule {}
