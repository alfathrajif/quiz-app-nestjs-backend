import { Module } from '@nestjs/common';
import { AnswersModule } from './answers/answers.module';
import { AttemptsModule } from './attempts/attempts.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ReceiptsModule } from './payments/receipts/receipts.module';
import { RequestsModule } from './payments/requests/requests.module';
import { QuestionsModule } from './questions/questions.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { UsersModule } from './users/users.module';
import { VerificationsModule } from './payments/verifications/verifications.module';
import { LogsModule } from './payments/logs/logs.module';
import { TryoutsModule } from './tryouts/tryouts.module';
import { SectionsModule } from './sections/sections.module';

@Module({
  imports: [
    CommonModule,
    QuestionsModule,
    AuthModule,
    UsersModule,
    QuizzesModule,
    AttemptsModule,
    AnswersModule,
    SubscriptionsModule,
    RequestsModule,
    ReceiptsModule,
    VerificationsModule,
    LogsModule,
    TryoutsModule,
    SectionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
