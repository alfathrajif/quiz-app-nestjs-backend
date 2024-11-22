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
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenPayload } from 'src/model/auth.model';
import {
  CreatePaymentRequest,
  PaymentRequest,
  UpdatePaymentRequest,
} from 'src/model/payment.model';
import { WebResponse } from 'src/model/web.model';
import { RequestsService } from './requests.service';

@Controller('payment-requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getPaymentRequests(
    @CurrentUser() user: TokenPayload,
  ): Promise<WebResponse<PaymentRequest[]>> {
    const paymentRequests = await this.requestsService.findAll(user.user_uuid);

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
    @CurrentUser() user: TokenPayload,
    @Body() createRequest: CreatePaymentRequest,
  ): Promise<WebResponse<PaymentRequest>> {
    const paymentRequest = await this.requestsService.create(
      user.user_uuid,
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
    @CurrentUser() user: TokenPayload,
    @Param('uuid') uuid: string,
    @Body() request: UpdatePaymentRequest,
  ): Promise<WebResponse<PaymentRequest>> {
    const paymentRequest = await this.requestsService.update(
      user.user_uuid,
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
