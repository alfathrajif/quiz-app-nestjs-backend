import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { SubscriptionPlansUserService } from './subscription-plans-user.service';
import { WebResponse } from 'src/model/web.model';
import { SubscriptionPlan } from 'src/model/subscription-plan';

@Controller('subscription-plans')
export class SubscriptionPlansUserController {
  constructor(
    private readonly subscriptionPlansUserService: SubscriptionPlansUserService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getSubscriptionPlansUser(): Promise<WebResponse<SubscriptionPlan[]>> {
    const plans = await this.subscriptionPlansUserService.findAll();

    return {
      message: 'Get Subscription Plans Succeed',
      success: true,
      status_code: HttpStatus.OK,
      data: plans,
    };
  }
}
