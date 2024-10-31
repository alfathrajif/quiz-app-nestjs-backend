import { Question } from './question.model';

export class Choice {
  uuid: string;
  text: string;
  question_uuid: string;
  question?: Question;
  is_correct: boolean;
  created_at: Date;
}

export class CreateChoice {
  text: string;
  is_correct: boolean;
}

export class UpdateChoice {
  uuid: string;
  text: string;
  is_correct: boolean;
}
