import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/common/prisma.service';
import { CreateSection } from 'src/model/section.model';

@Injectable()
export class SectionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(tryoutSlug: string) {
    const sections = await this.prismaService.section.findMany({
      where: {
        tryout: {
          slug: tryoutSlug,
        },
      },
    });
    return sections;
  }

  async findOne(slug: string) {
    const section = await this.prismaService.section.findFirst({
      where: {
        slug,
        deleted_at: null,
      },
      include: {
        quizzes: {
          include: {
            _count: {
              select: {
                questions: true,
              },
            },
          },
          where: {
            deleted_at: null,
          },
        },
      },
    });

    if (section) {
      section.quizzes = section.quizzes.map((quiz) => ({
        ...quiz,
        questions_count: quiz._count.questions,
        _count: undefined,
      }));
    }

    return section;
  }

  async create(userUuid: string, section: CreateSection) {
    const newSection = await this.prismaService.section.create({
      data: {
        name: section.name,
        slug: slugify(section.name, { lower: true }),
        description: section.description,
        user_uuid: userUuid,
        tryout_uuid: section.tryout_uuid,
      },
    });
    return newSection;
  }

  async update(uuid: string, section: CreateSection) {
    const updatedSection = await this.prismaService.section.update({
      where: {
        uuid,
      },
      data: {
        name: section.name,
        slug: slugify(section.name, { lower: true }),
        description: section.description,
        updated_at: new Date(),
      },
    });
    return updatedSection;
  }

  async softDelete(uuid: string) {
    await this.prismaService.section.update({
      where: {
        uuid,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
