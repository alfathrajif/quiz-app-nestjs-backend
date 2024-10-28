import { Choice } from './choice.model';
import { Question } from './question.model';
import { QuizAttempt } from './quiz.model';

export class Answer {
  uuid: string;
  question_uuid: string;
  question?: Question;
  quiz_attempt_uuid: string;
  attempt?: QuizAttempt;
  selected_choice_uuid: string;
  choice?: Choice;
  is_correct: boolean;
  created_at: Date;
}
