import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { TokenPayload } from 'src/model/auth.model';
import { CreatePaymentReceipt, PaymentReceipt } from 'src/model/payment.model';
import { WebResponse } from 'src/model/web.model';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { RequestsService } from '../requests/requests.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { PlansService } from 'src/subscriptions/plans/plans.service';

@Controller('payment-receipts')
export class ReceiptsController {
  constructor(
    private readonly receiptsService: ReceiptsService,
    private readonly requestsService: RequestsService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly plansService: PlansService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: TokenPayload,
    @Body() createReceipt: CreatePaymentReceipt,
  ): Promise<WebResponse<PaymentReceipt>> {
    await this.requestsService.update(
      user.user_uuid,
      createReceipt.payment_request_uuid,
      {
        status: 'paid',
      },
    );

    const paymentReceipt = await this.receiptsService.create(createReceipt);

    return {
      message: 'Payment receipt created',
      success: true,
      status_code: HttpStatus.CREATED,
      data: paymentReceipt,
    };
  }

  @Post('images')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file_image', {
      storage: multer.diskStorage({
        destination: './public/images/receipts',
        filename: (req, file, callback) => {
          const filename = `${Date.now()}-${file.originalname}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    _file: Express.Multer.File,
  ) {
    return {
      message: 'Image uploaded',
      success: true,
      status_code: HttpStatus.CREATED,
      data: _file,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getPaymentReceipts(
    @CurrentUser() user: TokenPayload,
  ): Promise<WebResponse<PaymentReceipt[]>> {
    const paymentReceipts = await this.receiptsService.findAll(user.user_uuid);

    return {
      message: 'Payment receipts fetched',
      success: true,
      status_code: HttpStatus.OK,
      data: paymentReceipts,
    };
  }

  @Patch(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser() user: TokenPayload,
    @Param('uuid') uuid: string,
    @Body() updateReceipt: { status: string; remarks?: string },
  ): Promise<WebResponse<PaymentReceipt>> {
    const updatedReceipt = await this.receiptsService.update(
      user.user_uuid,
      uuid,
      updateReceipt,
    );

    if (updatedReceipt.status === 'approved') {
      const premiumPlan = await this.plansService.findOne('premium');

      await this.subscriptionsService.create({
        user_uuid: updatedReceipt.payment_request.user_uuid,
        subscription_plan_uuid: premiumPlan.uuid,
        started_date: new Date(),
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        status: 'active',
      });
    }

    return {
      message: 'Payment receipt updated',
      success: true,
      status_code: HttpStatus.OK,
      data: updatedReceipt,
    };
  }
}
