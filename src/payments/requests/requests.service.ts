import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import {
  CreatePaymentRequest,
  UpdatePaymentRequest,
} from 'src/model/payment.model';

@Injectable()
export class RequestsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(userUuid: string) {
    const paymentRequests = await this.prismaService.paymentRequest.findMany({
      where: {
        user_uuid: userUuid,
      },
      select: {
        uuid: true,
        user: {
          select: {
            uuid: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        subscription_plan: {
          select: {
            uuid: true,
            name: true,
            description: true,
            price: true,
            duration: true,
          },
        },
        user_uuid: true,
        subscription_plan_uuid: true,
        amount: true,
        request_date: true,
        due_date: true,
        status: true,
        notes: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    await this.prismaService.paymentRequest.updateMany({
      where: {
        user_uuid: userUuid,
        status: 'pending',
        due_date: {
          lte: new Date(),
        },
      },
      data: {
        status: 'expired',
      },
    });

    return paymentRequests;
  }

  async create(userUuid: string, createPayment: CreatePaymentRequest) {
    const user = await this.prismaService.user.findUnique({
      where: {
        uuid: userUuid,
      },
    });

    if (!user.phone) {
      await this.prismaService.user.update({
        where: {
          uuid: userUuid,
        },
        data: {
          phone: createPayment.phone,
        },
      });
    }

    const paymentRequest = await this.prismaService.paymentRequest.create({
      data: {
        user_uuid: userUuid,
        subscription_plan_uuid: createPayment.subscription_plan_uuid,
        amount: createPayment.amount,
        request_date: new Date(),
        due_date: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 days
        status: 'pending',
        notes: createPayment.notes,
      },
      select: {
        uuid: true,
        subscription_plan_uuid: true,
        subscription_plan: {
          select: {
            uuid: true,
            name: true,
            description: true,
            price: true,
            duration: true,
          },
        },
        user_uuid: true,
        amount: true,
        request_date: true,
        due_date: true,
        status: true,
        notes: true,
      },
    });

    return paymentRequest;
  }

  async update(
    userUuid: string,
    requestUuid: string,
    request: UpdatePaymentRequest,
  ) {
    const paymentRequest = await this.prismaService.paymentRequest.update({
      where: {
        uuid: requestUuid,
        user_uuid: userUuid,
      },
      data: {
        status: request.status,
      },
      select: {
        uuid: true,
        subscription_plan_uuid: true,
        subscription_plan: {
          select: {
            uuid: true,
            name: true,
            description: true,
            price: true,
            duration: true,
          },
        },
        user_uuid: true,
        amount: true,
        request_date: true,
        due_date: true,
        status: true,
        notes: true,
      },
    });

    return paymentRequest;
  }
}
