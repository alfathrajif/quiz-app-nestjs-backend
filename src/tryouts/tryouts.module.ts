import { Module } from '@nestjs/common';
import { TryoutsService } from './tryouts.service';
import { TryoutsController } from './tryouts.controller';

@Module({
  controllers: [TryoutsController],
  providers: [TryoutsService],
})
export class TryoutsModule {}
