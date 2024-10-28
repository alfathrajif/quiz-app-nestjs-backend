import { Answer } from './answer.model';
import { Choice } from './choice.model';
import { Question } from './question.model';
import { UserResponse } from './user.model';

export class Quiz {
  uuid: string;
  title: string;
  slug: string;
  description: string;
  questions_count?: number;
  questions?: Question[];
  created_by?: {
    user: UserResponse;
  };
  created_at: Date;
}

export class QuizAttemptPayload {
  quiz_uuid: string;
  started_at: Date;
  completed_at: Date;
  selected_choices: (Choice | null)[];
}

export class QuizAttempt {
  uuid: string;
  quiz: Quiz;
  score: number;
  started_at: Date;
  completed_at: Date;
}

export class QuizEvaluation extends QuizAttempt {
  answers: Answer[];
}
