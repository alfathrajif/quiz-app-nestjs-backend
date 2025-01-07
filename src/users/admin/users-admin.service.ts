import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { User } from 'src/model/user.model';

@Injectable()
export class UsersAdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      where: {
        NOT: {
          role: {
            name: 'admin',
          },
        },
      },
      include: {
        role: true,
      },
    });
    return users;
  }
}
