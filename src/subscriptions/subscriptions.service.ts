import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { CreateSubscription, Subscription } from 'src/model/subscription.model';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(subscription: CreateSubscription): Promise<Subscription> {
    return await this.prismaService.subscription.create({
      data: subscription,
      include: {
        subscription_plan: true,
      },
    });
  }

  async update(subscription_uuid: string, status: string) {
    await this.prismaService.subscription.update({
      where: {
        uuid: subscription_uuid,
      },
      data: {
        status,
      },
    });
  }
}
