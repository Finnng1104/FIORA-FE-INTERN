import { prisma } from '@/config';
import type { IInvoiceRepository } from '@/features/invoices/application/repositories/invoices.interface';
import { InvoiceStatus } from '@/features/invoices/domain/entities/models/invoices';
import type {
  Invoice,
  RequestInvoiceInput,
} from '@/features/invoices/domain/entities/models/invoices';
import {
  Prisma,
  InvoiceStatus as PrismaInvoiceStatus,
  Invoice as PrismaInvoice,
} from '@prisma/client';

export class InvoiceRepository implements IInvoiceRepository {
  private mapInvoiceToDomain(prismaInvoice: PrismaInvoice): Invoice {
    return {
      id: prismaInvoice.id,
      reqNo: prismaInvoice.reqNo,
      reqDatetime: prismaInvoice.reqDatetime,
      cusName: prismaInvoice.cusName,
      taxNo: prismaInvoice.taxNo,
      taxAddress: prismaInvoice.taxAddress,
      email: prismaInvoice.email,
      phone: prismaInvoice.phone,
      status: InvoiceStatus[prismaInvoice.status],
      invNo: prismaInvoice.invNo,
      invDate: prismaInvoice.invDate,
      repNo: prismaInvoice.repNo,
      userId: prismaInvoice.userId,
      createdAt: prismaInvoice.createdAt,
      createdBy: prismaInvoice.createdBy,
      updatedAt: prismaInvoice.updatedAt,
      updatedBy: prismaInvoice.updatedBy,
    };
  }

  /**
   * Maps Domain InvoiceStatus to Prisma InvoiceStatus
   */
  private mapInvoiceStatusToPrisma(status: InvoiceStatus): PrismaInvoiceStatus {
    // Since enum values have the same names, we can safely cast
    return status as unknown as PrismaInvoiceStatus;
  }

  /**
   * Generates a sequential request number in the format 'REQ0000001'
   * Uses a transaction to ensure uniqueness even in concurrent scenarios
   */
  private async generateSequentialRequestNumber(tx: Prisma.TransactionClient): Promise<string> {
    // Find the highest reqNo
    const latestInvoice = await tx.invoice.findFirst({
      orderBy: {
        reqNo: 'desc',
      },
      select: {
        reqNo: true,
      },
    });

    // If no invoices exist yet, start with REQ0000001
    if (!latestInvoice) {
      return 'REQ0000001';
    }

    // Extract the numeric part and increment it
    const matches = latestInvoice.reqNo.match(/REQ(\d+)/);
    if (!matches || matches.length < 2) {
      // If for some reason the pattern doesn't match, start from 1
      return 'REQ0000001';
    }

    const currentNumber = parseInt(matches[1], 10);
    const nextNumber = currentNumber + 1;

    // Format the new number with leading zeros (7 digits)
    return `REQ${nextNumber.toString().padStart(7, '0')}`;
  }

  /**
   * Creates an invoice request and links it to an order
   */
  async createInvoiceRequest(
    data: RequestInvoiceInput,
    requestingUserId: string | null,
  ): Promise<Invoice> {
    // The status is always Requested
    const domainStatus = InvoiceStatus.Requested;
    // Convert to Prisma status for database operation
    const prismaStatus = this.mapInvoiceStatusToPrisma(domainStatus);

    const result = await prisma.$transaction(async (tx) => {
      // Generate the sequential request number
      const reqNo = await this.generateSequentialRequestNumber(tx);

      // Create invoice data
      const invoiceData: Prisma.InvoiceCreateInput = {
        reqNo: reqNo,
        reqDatetime: new Date(),
        orderNo: data.orderNo,
        cusName: data.customerName,
        taxNo: data.taxNo,
        taxAddress: data.taxAddress,
        email: data.email,
        phone: data.phone,
        status: prismaStatus,
        user: { connect: { id: data.providerId } },
        ...(requestingUserId && {
          creator: { connect: { id: requestingUserId } },
        }),
      };

      // Create the Invoice record
      const invoice = await tx.invoice.create({
        data: invoiceData,
      });

      // Create link between order and invoice
      const orderInvoiceData = {
        user: { connect: { id: data.providerId } },
        order: { connect: { orderNo: data.orderNo } },
        invoice: { connect: { reqNo: invoice.reqNo } },
        ...(requestingUserId && {
          creator: { connect: { id: requestingUserId } },
        }),
      };

      // Create the OrderInvoice link record
      await tx.orderInvoice.create({
        data: orderInvoiceData,
      });

      return this.mapInvoiceToDomain(invoice);
    });

    return result;
  }
}

export const invoiceRepository = new InvoiceRepository();
