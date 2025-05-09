import { BulkInvoiceRow, BulkImportResult } from '../../domain/dtos/bulk-invoice-import.dto';
import { BulkInvoiceValidationService } from '../../domain/services/bulk-invoice-validation.service';
import { IBulkInvoiceRepository } from '../repositories/bulk-invoices.interface';
import { BULK_IMPORT_ERROR_MESSAGES, BulkImportProcessError } from '../../domain/entities/errors/bulkImportErrors';
import { ImportFile } from '../../domain/types/bulk-import.types';

export class BulkImportInvoicesUseCase {
  constructor(private readonly bulkInvoiceRepository: IBulkInvoiceRepository) {}

  async execute(userId: string, input: ImportFile | BulkInvoiceRow[]): Promise<BulkImportResult> {
    try {
      let rows: BulkInvoiceRow[];

      if (Array.isArray(input)) {
        rows = input;
      } else {
        // Input is an ImportFile
        BulkInvoiceValidationService.validateFile(input);
        rows = BulkInvoiceValidationService.parseFileContent(input.content);
      }

      // Log the rows to be imported
      console.log('Importing rows:', {
        count: rows.length,
        firstRow: rows[0]
      });

      // Process import
      const importResult = await this.bulkInvoiceRepository.bulkImport(userId, rows);

      // Log import results
      console.log('Import completed:', {
        totalRows: rows.length,
        validRows: importResult.validRows,
        errors: importResult.errors,
        importedInvoices: importResult.importedInvoices
      });

      return {
        totalRows: rows.length,
        validRows: importResult.validRows,
        errors: importResult.errors,
        importedInvoices: importResult.importedInvoices
      };
    } catch (error) {
      console.error('Import processing error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });

      if (error instanceof BulkImportProcessError) {
        throw error;
      }
      
      throw new BulkImportProcessError(
        error instanceof Error ? error.message : BULK_IMPORT_ERROR_MESSAGES.PROCESSING_ERROR
      );
    }
  }

  async generateSampleFile(): Promise<Buffer> {
    return BulkInvoiceValidationService.generateSampleFile();
  }
}
