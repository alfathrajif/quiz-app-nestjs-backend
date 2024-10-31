import { Choice, CreateChoice, UpdateChoice } from './choice.model';

export class Question {
  uuid: string;
  number: string;
  text: string;
  explanation: string;
  choices: Choice[];
}

export class CreateQuestion {
  number: string;
  text: string;
  explanation: string;
  choices: CreateChoice[];
}

export class UpdateQuestion {
  uuid: string;
  number: string;
  text: string;
  explanation: string;
  choices: UpdateChoice[];
}
