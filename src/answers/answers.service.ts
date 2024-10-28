import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { Choice } from 'src/model/choice.model';

@Injectable()
export class AnswersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(attemptUuid: string, choices: Choice[]) {
    const cleanedChoices = choices.map(
      ({ uuid, question_uuid, is_correct, created_at }) => ({
        quiz_attempt_uuid: attemptUuid,
        question_uuid: question_uuid,
        selected_choice_uuid: uuid,
        is_correct: is_correct,
        created_at: created_at,
      }),
    );

    const answers = await this.prismaService.answer.createMany({
      data: cleanedChoices,
    });

    return answers;
  }
}
