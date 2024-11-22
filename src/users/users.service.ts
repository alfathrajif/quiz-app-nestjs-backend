import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import {
  CreateUserRequest,
  CreateUserResponse,
  User,
} from 'src/model/user.model';
import { PlansService } from 'src/subscriptions/plans/plans.service';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly plansService: PlansService,
    private readonly subcriptionsService: SubscriptionsService,
  ) {}

  async getUser(filter: Prisma.UserWhereUniqueInput): Promise<User | null> {
    try {
      // Find user by filter
      const user = await this.prismaService.user.findUnique({
        where: filter,
        include: {
          role: true,
          subscriptions: {
            select: {
              uuid: true,
              started_date: true,
              end_date: true,
              status: true,
              subscription_plan_uuid: true,
              subscription_plan: {
                select: {
                  uuid: true,
                  name: true,
                  price: true,
                  description: true,
                  duration: true,
                },
              },
            },
          },
          payment_requests: {
            select: {
              uuid: true,
              user_uuid: true,
              subscription_plan_uuid: true,
              amount: true,
              request_date: true,
              due_date: true,
              status: true,
              notes: true,
            },
          },
        },
      });
      if (!user) {
        console.error('User not found');
        return null;
      }

      // If user has no subscription, create a basic subscription
      if (!user.subscriptions.length || user.subscriptions.length === 0) {
        const basicPlan = await this.plansService.findOne('basic');
        if (!basicPlan) {
          throw new NotFoundException('Basic plan not found');
        }

        await this.subcriptionsService.create({
          user_uuid: user.uuid,
          subscription_plan_uuid: basicPlan.uuid,
          end_date: new Date(
            new Date().setDate(new Date().getDate() + 100_000),
          ),
          started_date: new Date(),
          status: 'active',
        });
      }

      // Check if user has any expired subscription
      for (const subscription of user.subscriptions) {
        if (
          subscription &&
          subscription.subscription_plan.name === 'premium' &&
          subscription.status === 'active' &&
          subscription.end_date < new Date()
        ) {
          try {
            await this.subcriptionsService.update(subscription.uuid, 'expired');
          } catch (error) {
            console.error(
              `Error updating subscription: ${subscription.uuid}`,
              error,
            );
          }
        }
      }

      // Sort subscriptions by premium first
      const subscription = user.subscriptions
        .filter((sub) => sub.status === 'active')
        .sort((a, b) => {
          if (
            a.subscription_plan.name === 'premium' &&
            b.subscription_plan.name !== 'premium'
          ) {
            return -1;
          }
          if (
            b.subscription_plan.name === 'premium' &&
            a.subscription_plan.name !== 'premium'
          ) {
            return 1;
          }
          return 0;
        })[0];

      // Remove subscriptions from the final result
      delete user.subscriptions;

      return {
        ...user,
        subscription: subscription,
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('An error occurred while fetching the user data');
    }
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
