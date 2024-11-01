import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import {
  CreateUserRequest,
  CreateUserResponse,
  User,
} from 'src/model/user.model';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUser(filter: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: filter,
      include: {
        role: true,
      },
    });
    return user;
  }

  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    const role = await this.prismaService.role.findFirst({
      where: {
        name: data.role,
      },
    });

    const user = await this.prismaService.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        phone: data.phone,
        role: {
          connect: {
            uuid: role.uuid,
          },
        },
      },
    });

    return user;
  }
}
