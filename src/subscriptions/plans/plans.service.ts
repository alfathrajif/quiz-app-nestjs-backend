import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class PlansService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    try {
      const plans = await this.prismaService.subscriptionPlan.findMany();

      return plans;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw new Error('An error occurred while fetching subscription plans');
    }
  }

  async findOne(name: string) {
    const plan = await this.prismaService.subscriptionPlan.findFirst({
      where: {
        name,
      },
    });

    return plan;
  }
}
