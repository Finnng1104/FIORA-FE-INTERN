import { BulkInvoiceRow, BulkImportResult } from '../../domain/dtos/bulk-invoice-import.dto';
import { Prisma } from '@prisma/client';

export interface IBulkInvoiceRepository {
  bulkImport(userId: string, invoices: BulkInvoiceRow[]): Promise<BulkImportResult>;
  generateRequestNumber(tx: Prisma.TransactionClient): Promise<string>;
}
