import { Module } from '@nestjs/common';
import { AnswersModule } from './answers/answers.module';
import { AttemptsModule } from './attempts/attempts.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { LogsModule } from './payments/logs/logs.module';
import { ReceiptsModule } from './payments/receipts/receipts.module';
import { RequestsModule } from './payments/requests/requests.module';
import { VerificationsModule } from './payments/verifications/verifications.module';
import { QuestionsModule } from './questions/questions.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { SectionsModule } from './sections/sections.module';
import { SubscriptionPlansAdminModule } from './subscription-plans/admin/subscription-plans-admin.module';
import { SubscriptionPlansUserModule } from './subscription-plans/user/subscription-plans-user.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { TryoutsModule } from './tryouts/tryouts.module';
import { UsersUserModule } from './users/user/users-user.module';
import { UsersAdminModule } from './users/admin/users-admin.module';
import { AdministratorsModule } from './administrators/administrators.module';

@Module({
  imports: [
    CommonModule,
    QuestionsModule,
    AuthModule,
    UsersUserModule,
    UsersAdminModule,
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
    SubscriptionPlansAdminModule,
    SubscriptionPlansUserModule,
    AdministratorsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
