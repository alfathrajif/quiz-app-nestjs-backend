import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const questions = await this.prismaService.question.findMany({
      include: {
        choices: true,
      },
    });

    return questions;
  }
}
