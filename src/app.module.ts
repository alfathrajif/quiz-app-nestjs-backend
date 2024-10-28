import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { QuestionsModule } from './questions/questions.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { AttemptsModule } from './attempts/attempts.module';
import { AnswersModule } from './answers/answers.module';

@Module({
  imports: [
    CommonModule,
    QuestionsModule,
    AuthModule,
    UsersModule,
    QuizzesModule,
    AttemptsModule,
    AnswersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
