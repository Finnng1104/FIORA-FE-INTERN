import { PrismaClient, InvoiceStatus, Prisma } from '@prisma/client';
import { IBulkInvoiceRepository } from '../../application/repositories/bulk-invoices.interface';
import { BulkInvoiceRow, BulkImportResult } from '../../domain/dtos/bulk-invoice-import.dto';
import { BulkImportProcessError, BULK_IMPORT_ERROR_MESSAGES } from '../../domain/entities/errors/bulkImportErrors';

export class PrismaBulkInvoiceRepository implements IBulkInvoiceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async bulkImport(userId: string, invoices: BulkInvoiceRow[]): Promise<BulkImportResult> {
    const result: BulkImportResult = {
      totalRows: invoices.length,
      validRows: 0,
      errors: [],
      importedInvoices: [],
    };

    // Log the input
    console.log('Repository Import Start:', {
      userId,
      invoiceCount: invoices.length,
      firstInvoice: invoices[0]
    });

    // Use transaction to ensure data consistency
    try {
      await this.prisma.$transaction(async (tx) => {
        for (const [index, invoice] of invoices.entries()) {
          try {
            // Check if order exists
            const order = await tx.order.findUnique({
              where: { orderNo: invoice.order_no },
            });

            if (!order) {
              result.errors.push({
                rowIndex: index,
                field: 'order_no',
                message: `Order ${invoice.order_no} not found`,
              });
              continue;
            }

            // Check if invoice already exists for this order
            const existingInvoice = await tx.orderInvoice.findFirst({
              where: { orderNo: invoice.order_no },
            });

            if (existingInvoice) {
              result.errors.push({
                rowIndex: index,
                field: 'order_no',
                message: `Invoice already exists for order ${invoice.order_no}`,
              });
              continue;
            }

            const reqNo = await this.generateRequestNumber(tx);
            
            const createdInvoice = await tx.invoice.create({
              data: {
                userId,
                reqNo,
                reqDatetime: new Date(),
                orderNo: invoice.order_no,
                cusName: invoice.cus_name,
                taxNo: invoice.tax_no,
                taxAddress: invoice.cus_address,
                email: invoice.email,
                phone: invoice.phone,
                status: InvoiceStatus.Requested,
                createdBy: userId,
              },
            });

            // Create order invoice relation
            await tx.orderInvoice.create({
              data: {
                userId,
                orderNo: invoice.order_no,
                invNo: reqNo,
                createdBy: userId,
              },
            });

            result.validRows++;
            result.importedInvoices.push(createdInvoice.id);

            // Log successful import
            console.log(`Successfully imported invoice for order ${invoice.order_no}`);
          } catch (error) {
            let errorMessage = 'Failed to create invoice record';
            
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
              switch (error.code) {
                case 'P2002':
                  errorMessage = 'Duplicate invoice request number';
                  break;
                case 'P2003':
                  errorMessage = 'Referenced order does not exist';
                  break;
                default:
                  errorMessage = `Database error: ${error.message}`;
              }
            }

            console.error('Failed to import invoice:', {
              error,
              orderNo: invoice.order_no,
              errorMessage
            });

            result.errors.push({
              rowIndex: index,
              field: 'order_no',
              message: errorMessage,
            });
          }
        }
      });

      // Log final results
      console.log('Repository Import Complete:', {
        totalProcessed: result.totalRows,
        successfulImports: result.validRows,
        failedImports: result.errors.length,
        importedIds: result.importedInvoices
      });

      if (result.validRows === 0) {
        throw new BulkImportProcessError(BULK_IMPORT_ERROR_MESSAGES.NO_RECORDS_IMPORTED);
      }

      return result;
    } catch (error) {
      console.error('Transaction error:', error);
      throw error;
    }
  }

  async generateRequestNumber(tx: Prisma.TransactionClient): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get count of invoices for today
    const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const count = await tx.invoice.count({
      where: {
        createdAt: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
    });

    const sequence = (count + 1).toString().padStart(4, '0');
    return `REQ${year}${month}${day}${sequence}`;
  }
}
