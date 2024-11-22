import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { PlansService } from './plans.service';
import { WebResponse } from 'src/model/web.model';
import { SubscriptionPlan } from 'src/model/subscription.model';

@Controller('subcription-plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getSubscriptionPlans(): Promise<WebResponse<SubscriptionPlan[]>> {
    const plans = await this.plansService.findAll();

    return {
      message: 'Get Subscription Plans Succeed',
      success: true,
      status_code: HttpStatus.OK,
      data: plans,
    };
  }
}
