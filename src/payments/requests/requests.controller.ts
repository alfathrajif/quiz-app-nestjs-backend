import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  CreatePaymentRequest,
  PaymentRequest,
  UpdatePaymentRequest,
} from 'src/model/payment.model';
import { WebResponse } from 'src/model/web.model';
import { RequestsService } from './requests.service';
import { UserResponse } from 'src/model/user.model';

@Controller('payment-requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getPaymentRequests(
    @CurrentUser() user: UserResponse,
  ): Promise<WebResponse<PaymentRequest[]>> {
    const paymentRequests = await this.requestsService.findAll(user.uuid);

    return {
      message: 'Payment requests retrieved',
      success: true,
      status_code: HttpStatus.OK,
      data: paymentRequests,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: UserResponse,
    @Body() createRequest: CreatePaymentRequest,
  ): Promise<WebResponse<PaymentRequest>> {
    const paymentRequest = await this.requestsService.create(
      user.uuid,
      createRequest,
    );

    return {
      message: 'Payment request created',
      success: true,
      status_code: HttpStatus.CREATED,
      data: paymentRequest,
    };
  }

  @Patch(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async updateRequest(
    @CurrentUser() user: UserResponse,
    @Param('uuid') uuid: string,
    @Body() request: UpdatePaymentRequest,
  ): Promise<WebResponse<PaymentRequest>> {
    const paymentRequest = await this.requestsService.update(
      user.uuid,
      uuid,
      request,
    );
    return {
      message: 'Payment request status updated',
      success: true,
      status_code: HttpStatus.OK,
      data: paymentRequest,
    };
  }
}
