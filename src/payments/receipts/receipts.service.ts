import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { PrismaService } from 'src/common/prisma.service';
import { CreatePaymentReceipt, PaymentReceipt } from 'src/model/payment.model';

@Injectable()
export class ReceiptsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(receipt: CreatePaymentReceipt): Promise<PaymentReceipt> {
    const paymentReceipt = await this.prismaService.paymentReceipt.create({
      data: {
        payment_request_uuid: receipt.payment_request_uuid,
        upload_date: receipt.upload_date,
        payment_date: receipt.payment_date,
        amount_paid: parseFloat(receipt.amount_paid.toString()),
        payment_proof_image: receipt.payment_proof_image,
        status: receipt.status,
      },
      include: {
        payment_request: true,
      },
    });

    return paymentReceipt;
  }

  async findAll(userUuid: string): Promise<PaymentReceipt[]> {
    const paymentReceipts = await this.prismaService.paymentReceipt.findMany({
      where: {
        payment_request: {
          user_uuid: userUuid,
        },
      },
      include: {
        reviewed_by: true,
        payment_request: {
          include: {
            subscription_plan: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return paymentReceipts;
  }

  async update(
    uuid: string,
    receiptUuid: string,
    receipt: {
      status: string;
      remarks?: string;
    },
  ): Promise<PaymentReceipt> {
    const updatedReceipt = await this.prismaService.paymentReceipt.update({
      where: {
        uuid: receiptUuid,
      },
      data: {
        status: receipt.status,
        reviewed_by_uuid: uuid,
        review_date: new Date(),
        remarks: receipt.remarks,
      },
      include: {
        payment_request: true,
      },
    });

    return updatedReceipt;
  }

  getReceiptImageByFilename(filename: string, res: Response) {
    const filePath = join(process.cwd(), 'public/images/receipts', filename);

    return res.sendFile(filePath);
  }
}
