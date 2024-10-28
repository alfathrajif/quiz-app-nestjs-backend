import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { QuizAttemptPayload } from 'src/model/quiz.model';

@Injectable()
export class AttemptsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(userUuid: string, attempt: QuizAttemptPayload) {
    let calculatedScore = 0;

    attempt.selected_choices.forEach((choice) => {
      if (choice?.is_correct) {
        calculatedScore += 1;
      }
    });

    return this.prismaService.quizAttempt.create({
      data: {
        user_uuid: userUuid,
        quiz_uuid: attempt.quiz_uuid,
        score: calculatedScore,
        started_at: attempt.started_at,
        completed_at: attempt.completed_at,
      },
    });
  }

  async findOne(userUuid: string, attemptUuid: string) {
    const attempt = await this.prismaService.quizAttempt.findFirst({
      where: {
        uuid: attemptUuid,
        user_uuid: userUuid,
      },
      include: {
        answers: {
          include: {
            question: {
              include: {
                choices: true,
              },
            },
          },
          orderBy: {
            question: {
              number: 'asc',
            },
          },
        },
        quiz: {
          include: {
            _count: {
              select: {
                questions: true,
              },
            },
          },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException('Cannot find the requested resource');
    }

    const questionsCount = attempt.quiz._count.questions;

    delete attempt.quiz._count;

    const sanitizedAttempt = {
      ...attempt,
      quiz: {
        ...attempt.quiz,
        questions_count: questionsCount,
      },
    };

    return sanitizedAttempt;
  }
}
