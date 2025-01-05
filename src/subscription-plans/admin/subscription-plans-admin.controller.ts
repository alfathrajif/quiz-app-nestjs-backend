import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionPlansAdminService } from './subscription-plans-admin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { WebResponse } from 'src/model/web.model';
import {
  CreateSubscriptionPlan,
  SubscriptionPlanAdmin,
} from 'src/model/subscription-plan';

@Roles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/subscription-plans')
export class SubscriptionPlansAdminController {
  constructor(
    private readonly subscriptionPlansAdminService: SubscriptionPlansAdminService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async createSubscriptionPlanAdmin(
    @Body() subscriptionPlan: SubscriptionPlanAdmin,
  ): Promise<WebResponse<SubscriptionPlanAdmin>> {
    const createdSubscriptionPlan =
      await this.subscriptionPlansAdminService.create(subscriptionPlan);
    return {
      message: 'Create Subscription Plan Succeed',
      success: true,
      status_code: HttpStatus.OK,
      data: createdSubscriptionPlan,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getSubscriptionPlansAdmin(): Promise<
    WebResponse<SubscriptionPlanAdmin[]>
  > {
    const subscriptionPlans =
      await this.subscriptionPlansAdminService.findAll();
    return {
      message: 'Get Subscription Plans Succeed',
      success: true,
      status_code: HttpStatus.OK,
      data: subscriptionPlans,
    };
  }

  @Patch(':uuid')
  @HttpCode(HttpStatus.OK)
  async updateSubscriptionPlanAdmin(
    @Param('uuid') uuid: string,
    @Body() subscriptionPlan: CreateSubscriptionPlan,
  ): Promise<WebResponse<SubscriptionPlanAdmin>> {
    const updatedSubscriptionPlan =
      await this.subscriptionPlansAdminService.update(uuid, subscriptionPlan);

    return {
      message: 'Update Subscription Plan Succeed',
      success: true,
      status_code: HttpStatus.OK,
      data: updatedSubscriptionPlan,
    };
  }

  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  async softDeleteSubscriptionPlanAdmin(
    @Param('uuid') uuid: string,
  ): Promise<WebResponse<null>> {
    await this.subscriptionPlansAdminService.softDelete(uuid);

    return {
      message: 'Soft Delete Subscription Plan Succeed',
      success: true,
      status_code: HttpStatus.OK,
    };
  }
}
