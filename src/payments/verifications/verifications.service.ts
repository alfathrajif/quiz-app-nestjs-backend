import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { PaymentVerification } from 'src/model/payment.model';

@Injectable()
export class VerificationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<PaymentVerification[]> {
    const paymentReceipt = await this.prismaService.paymentReceipt.findMany({
      include: {
        reviewed_by: true,
        payment_request: {
          include: {
            user: true,
            subscription_plan: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const paymentVerifications = paymentReceipt.map((receipt) => {
      return {
        ...receipt,
        verified_by: receipt.reviewed_by,
        verification_date: receipt.review_date,
        status: receipt.status,
        remarks: receipt.remarks,
      };
    });

    return paymentVerifications;
  }
}
