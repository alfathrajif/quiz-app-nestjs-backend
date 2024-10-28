import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class QuizzesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const quizzes = await this.prismaService.quiz.findMany({
      include: {
        created_by: {
          select: {
            uuid: true,
            name: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });

    const sanitizedQuizzes = quizzes.map((quiz) => {
      const questionsCount = quiz._count.questions;
      const createdBy = {
        user: quiz.created_by,
      };

      delete quiz.updated_at;
      delete quiz.user_uuid;
      delete quiz.created_by;
      delete quiz._count;

      return {
        ...quiz,
        questions_count: questionsCount,
        created_by: createdBy,
      };
    });

    return sanitizedQuizzes;
  }

  async findOne(slug: string) {
    const quiz = await this.prismaService.quiz.findFirst({
      where: {
        slug: slug,
      },
      include: {
        created_by: {
          select: {
            uuid: true,
            name: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: {
            questions: true,
          },
        },
        questions: {
          include: {
            choices: true,
          },
          orderBy: {
            number: 'asc',
          },
        },
      },
    });

    const questionsCount = quiz._count.questions;
    const createdBy = {
      user: quiz.created_by,
    };

    delete quiz.updated_at;
    delete quiz.user_uuid;
    delete quiz.created_by;
    delete quiz._count;

    const sanitizedQuiz = {
      ...quiz,
      questions_count: questionsCount,
      created_by: createdBy,
    };

    return sanitizedQuiz;
  }
}
