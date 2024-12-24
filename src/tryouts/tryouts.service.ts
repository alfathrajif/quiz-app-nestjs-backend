import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/common/prisma.service';
import { CreateTryout } from 'src/model/tryout.model';

@Injectable()
export class TryoutsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userUuid: string, tryout: CreateTryout) {
    const newTryout = await this.prismaService.tryout.create({
      data: {
        title: tryout.title,
        slug: slugify(tryout.title, { lower: true }),
        description: tryout.description,
        user_uuid: userUuid,
      },
      include: {
        created_by: {
          include: {
            role: true,
          },
        },
        sections: {
          orderBy: {
            created_at: 'asc',
          },
        },
      },
    });

    return newTryout;
  }

  async findAll() {
    const tryouts = await this.prismaService.tryout.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        created_by: {
          include: {
            role: true,
          },
        },
        sections: {
          where: {
            deleted_at: null,
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });

    return tryouts;
  }

  async findOne(slug: string) {
    const tryout = await this.prismaService.tryout.findFirst({
      where: {
        slug,
        deleted_at: null,
      },
      include: {
        created_by: {
          include: {
            role: true,
          },
        },
        sections: {
          where: {
            deleted_at: null,
          },
          include: {
            quizzes: {
              where: {
                deleted_at: null,
              },
            },
          },
          orderBy: {
            created_at: 'asc',
          },
        },
      },
    });

    return tryout;
  }

  async update(uuid: string, tryout: CreateTryout) {
    const updatedTryout = await this.prismaService.tryout.update({
      where: {
        uuid,
      },
      data: {
        title: tryout.title,
        slug: slugify(tryout.title, { lower: true }),
        description: tryout.description,
      },
      include: {
        created_by: {
          include: {
            role: true,
          },
        },
        sections: {
          orderBy: {
            created_at: 'asc',
          },
        },
      },
    });

    return updatedTryout;
  }

  async softDelete(uuid: string) {
    await this.prismaService.tryout.update({
      where: {
        uuid,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
