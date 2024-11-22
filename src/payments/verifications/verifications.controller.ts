import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { VerificationsService } from './verifications.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaymentVerification } from 'src/model/payment.model';
import { WebResponse } from 'src/model/web.model';

@Controller('payment-verifications')
export class VerificationsController {
  constructor(private readonly verificationsService: VerificationsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<WebResponse<PaymentVerification[]>> {
    const verifications = await this.verificationsService.findAll();

    return {
      message: 'Payment verifications retrieved successfully',
      success: true,
      status_code: HttpStatus.OK,
      data: verifications,
    };
  }
}
