import { Module } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';

@Module({
  controllers: [SectionsController],
  providers: [SectionsService],
})
export class SectionsModule {}
