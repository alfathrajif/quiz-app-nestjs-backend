import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { CreateSubscriptionPlan } from 'src/model/subscription-plan';

@Injectable()
export class SubscriptionPlansAdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateSubscriptionPlan) {
    const subscriptionPlan = await this.prismaService.subscriptionPlan.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        deleted_at: null,
      },
      include: {
        payment_requests: true,
        subscriptions: true,
      },
    });

    return subscriptionPlan;
  }

  async findAll() {
    try {
      const plans = await this.prismaService.subscriptionPlan.findMany({
        where: {
          deleted_at: null,
        },
        include: {
          payment_requests: true,
          subscriptions: true,
        },
      });

      // Find premium and basic plans
      const premiumPlan = plans.find((plan) => plan.name === 'premium');
      const basicPlan = plans.find((plan) => plan.name === 'basic');

      if (premiumPlan && basicPlan) {
        // Get user_uuids from premium subscriptions
        const premiumUserUuids = new Set(
          premiumPlan.subscriptions.map(
            (subscription) => subscription.user_uuid,
          ),
        );

        // Filter basic subscriptions to exclude users present in premium
        basicPlan.subscriptions = basicPlan.subscriptions.filter(
          (subscription) => !premiumUserUuids.has(subscription.user_uuid),
        );
      }

      return plans;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw new Error('An error occurred while fetching subscription plans');
    }
  }

  async update(uuid: string, data: CreateSubscriptionPlan) {
    const updatedSubscriptionPlan =
      await this.prismaService.subscriptionPlan.update({
        where: {
          uuid,
        },
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          duration: data.duration,
          updated_at: new Date(),
        },
        include: {
          payment_requests: true,
          subscriptions: true,
        },
      });

    return updatedSubscriptionPlan;
  }

  async softDelete(uuid: string) {
    await this.prismaService.subscriptionPlan.update({
      where: {
        uuid,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
