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
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreatePaymentReceipt, PaymentReceipt } from 'src/model/payment.model';
import { WebResponse } from 'src/model/web.model';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { RequestsService } from '../requests/requests.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { SubscriptionPlansUserService } from 'src/subscription-plans/user/subscription-plans-user.service';
import { Subscription } from 'src/model/subscription.model';
import { PrismaService } from 'src/common/prisma.service';
import { UserResponse } from 'src/model/user.model';

@Controller('payment-receipts')
export class ReceiptsController {
  constructor(
    private readonly receiptsService: ReceiptsService,
    private readonly requestsService: RequestsService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly SubscriptionPlansUserService: SubscriptionPlansUserService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: UserResponse,
    @Body() createReceipt: CreatePaymentReceipt,
  ): Promise<WebResponse<PaymentReceipt>> {
    await this.requestsService.update(
      user.uuid,
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

  @Get('images/:filename')
  getReceiptImage(@Param('filename') filename: string, @Response() res) {
    return this.receiptsService.getReceiptImageByFilename(filename, res);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getPaymentReceipts(
    @CurrentUser() user: UserResponse,
  ): Promise<WebResponse<PaymentReceipt[]>> {
    const paymentReceipts = await this.receiptsService.findAll(user.uuid);

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
    @CurrentUser() user: UserResponse,
    @Param('uuid') uuid: string,
    @Body() updateReceipt: { status: string; remarks?: string },
  ): Promise<WebResponse<PaymentReceipt>> {
    const updatedReceipt = await this.receiptsService.update(
      user.uuid,
      uuid,
      updateReceipt,
    );

    if (updatedReceipt.status === 'approved') {
      const premiumPlan =
        await this.SubscriptionPlansUserService.findOne('premium');

      let period: Date;
      if (premiumPlan.duration === 'monthly') {
        period = new Date(new Date().setMonth(new Date().getMonth() + 1));
      } else if (premiumPlan.duration === 'weekly') {
        period = new Date(new Date().setDate(new Date().getDate() + 7));
      }

      const newSubscription: Subscription =
        await this.subscriptionsService.create({
          user_uuid: updatedReceipt.payment_request.user_uuid,
          subscription_plan_uuid: premiumPlan.uuid,
          started_date: new Date(),
          end_date: period,
          status: 'active',
        });

      await this.prismaService.paymentLog.create({
        data: {
          user_uuid: updatedReceipt.payment_request.user_uuid,
          amount: newSubscription.subscription_plan.price,
          payment_date: new Date(),
          subscription_uuid: newSubscription.uuid,
        },
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
