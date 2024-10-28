import { Question } from './question.model';

export class Choice {
  uuid: string;
  choice_text: string;
  question_uuid: string;
  question?: Question;
  is_correct: boolean;
  created_at: Date;
}
