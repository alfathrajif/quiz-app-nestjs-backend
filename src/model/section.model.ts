import { Quiz } from './quiz.model';
import { Tryout } from './tryout.model';
import { User } from './user.model';

export class Section {
  uuid: string;
  name: string;
  description: string;
  tryout?: Tryout;
  tryout_uuid: string;
  created_by?: User;
  user_uuid: string;
  quizzes?: Quiz[];
  created_at: Date;
  updated_at: Date;
}

export class CreateSection {
  name: string;
  description: string;
  tryout_uuid: string;
  user_uuid: string;
}
