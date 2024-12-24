import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { QuizAttemptPayload } from 'src/model/quiz.model';

@Injectable()
export class AttemptsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userUuid: string, attempt: QuizAttemptPayload) {
    try {
      // Validate required fields
      if (!userUuid || !attempt.quiz_uuid || !attempt.selected_choices) {
        throw new Error('Invalid input: Missing required fields');
      }

      // Calculate the score based on correct choices
      const calculatedScore = attempt.selected_choices.reduce(
        (score, choice) => (choice?.is_correct ? score + 1 : score),
        0,
      );

      // Create the quiz attempt record in the database
      return await this.prismaService.quizAttempt.create({
        data: {
          user_uuid: userUuid,
          quiz_uuid: attempt.quiz_uuid,
          score: calculatedScore,
          started_at: attempt.started_at,
          completed_at: attempt.completed_at,
        },
      });
    } catch (error) {
      console.error('Error creating quiz attempt:', error.message);
      throw new InternalServerErrorException(
        'Failed to create quiz attempt. Please try again.',
      );
    }
  }

  async findOne(userUuid: string, attemptUuid: string) {
    try {
      // Fetch the quiz attempt with related data
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

      // Handle case where attempt is not found
      if (!attempt) {
        throw new NotFoundException('Quiz attempt not found');
      }

      // Extract and transform the required data
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
    } catch (error) {
      console.error('Error fetching quiz attempt:', error.message);
      // Rethrow known exceptions or handle unexpected errors
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch quiz attempt. Please try again.',
      );
    }
  }
}
