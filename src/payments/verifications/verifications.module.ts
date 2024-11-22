import { Module } from '@nestjs/common';
import { VerificationsService } from './verifications.service';
import { VerificationsController } from './verifications.controller';

@Module({
  controllers: [VerificationsController],
  providers: [VerificationsService],
})
export class VerificationsModule {}
