import { Choice } from './choice.model';

export class Question {
  uuid: string;
  number: string;
  text: string;
  explanation: string;
  choices: Choice[];
}
