import { Section } from './section.model';
import { User } from './user.model';

export class Tryout {
  uuid: string;
  title: string;
  slug: string;
  description: string;
  created_by: User;
  sections: Section[];
  user_uuid: string;
  created_at: Date;
  updated_at: Date;
}

export class CreateTryout {
  title: string;
  description: string;
  user_uuid: string;
}
