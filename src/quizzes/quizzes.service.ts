import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/common/prisma.service';
import { CreateQuiz, UpdateQuiz } from 'src/model/quiz.model';

@Injectable()
export class QuizzesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(sectionSlug: string) {
    const quizzes = await this.prismaService.quiz.findMany({
      where: {
        section: {
          slug: sectionSlug,
        },
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
        deleted_at: null,
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

    if (!quiz) {
      return null;
    }

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

  async create(userUuid: string, quiz: CreateQuiz) {
    const section = await this.prismaService.section.findFirst({
      where: {
        slug: quiz.section_slug,
      },
    });

    const newQuiz = await this.prismaService.quiz.create({
      data: {
        title: quiz.title,
        slug: slugify(quiz.title, { lower: true }),
        description: quiz.description,
        user_uuid: userUuid,
        section_uuid: section.uuid,
        questions: {
          create: quiz.questions.map((question, index) => {
            return {
              number: (index + 1).toString(),
              text: question.text,
              choices: {
                create: question.choices.map((choice) => {
                  return {
                    text: choice.text,
                    is_correct: choice.is_correct,
                  };
                }),
              },
              explanation: question.explanation,
            };
          }),
        },
      },
    });

    return newQuiz;
  }

  async update(uuid: string, quiz: UpdateQuiz) {
    const updatedQuiz = await this.prismaService.quiz.update({
      where: { uuid },
      data: {
        title: quiz.title,
        description: quiz.description,
      },
    });

    const existingQuestions = await this.prismaService.question.findMany({
      where: { quiz_uuid: updatedQuiz.uuid },
    });

    const inputQuestionUUIDs = quiz.questions.map((question) => question.uuid);

    for (const existingQuestion of existingQuestions) {
      if (!inputQuestionUUIDs.includes(existingQuestion.uuid)) {
        // Hapus semua pilihan terkait dengan pertanyaan ini terlebih dahulu
        await this.prismaService.choice.deleteMany({
          where: { question_uuid: existingQuestion.uuid },
        });
        // Hapus pertanyaan itu sendiri
        await this.prismaService.question.delete({
          where: { uuid: existingQuestion.uuid },
        });
      }
    }

    for (const question of quiz.questions) {
      const updatedQuestion = await this.prismaService.question.upsert({
        where: { uuid: question.uuid },
        update: {
          text: question.text,
          explanation: question.explanation,
        },
        create: {
          number: question.number.toString(),
          text: question.text,
          explanation: question.explanation,
          quiz_uuid: updatedQuiz.uuid,
        },
      });

      for (const choice of question.choices) {
        await this.prismaService.choice.upsert({
          where: { uuid: choice.uuid },
          update: {
            text: choice.text,
            is_correct: choice.is_correct,
          },
          create: {
            text: choice.text,
            is_correct: choice.is_correct,
            question_uuid: updatedQuestion.uuid,
          },
        });
      }
    }

    const quizQuestions = await this.prismaService.quiz.findFirst({
      where: {
        uuid,
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

    return quizQuestions;
  }

  async softDelete(uuid: string) {
    await this.prismaService.quiz.update({
      where: {
        uuid,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
