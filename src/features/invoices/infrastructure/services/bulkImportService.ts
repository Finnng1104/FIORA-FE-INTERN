import * as XLSX from 'xlsx';
import { bulkInvoiceValidationService } from '../../domain/services/bulk-invoice-validation.service';
import { ValidatedRecord } from '../../domain/types/bulk-import.types';

export class BulkImportService {
  private validateFileSize(file: File | { size: number }): boolean {
    const maxSize = 2 * 1024 * 1024; // 2MB
    return file.size <= maxSize;
  }

  private validateFileType(type: string): boolean {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'text/csv', // .csv
    ];
    return allowedTypes.includes(type);
  }

  private validateRowCount(rows: any[]): boolean {
    const maxRows = 1001; // Maximum 1000 rows + 1 header row
    return rows.length < maxRows;
  }

  private async readFileBuffer(buffer: ArrayBuffer): Promise<any[]> {
    try {
      const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      return XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        defval: '', // Default empty cells to empty string
      });
    } catch {
      throw new Error('Failed to parse file');
    }
  }

  private mapExcelRow(row: any) {
    // All possible header variations
    const possibleHeaders = {
      user_name: ['User Name', 'user_name', 'Username', 'User', 'Name'],
      cus_name: ['Customer Name', 'cus_name', 'Customer', 'CustomerName'],
      tax_no: ['Tax Code', 'tax_no', 'TaxCode', 'Tax Number', 'Tax', 'MST', 'Mã số thuế'],
      email: ['Email', 'email', 'Email Address', 'Mail'],
      phone: ['Phone Number', 'phone', 'Phone', 'Tel', 'Telephone', 'Mobile', 'SĐT', 'Số điện thoại'],
      order_no: ['Order Number', 'order_no', 'Order', 'OrderNo', 'Order No'],
      cus_address: ['Address', 'cus_address', 'Customer Address', 'Location', 'Địa chỉ']
    };

    // Function to find value using possible headers
    const findValue = (headerVariations: string[]) => {
      for (const header of headerVariations) {
        if (row[header] !== undefined) {
          return row[header].toString().trim();
        }
      }
      return '';
    };

    // Map the row data
    return {
      user_name: findValue(possibleHeaders.user_name),
      cus_name: findValue(possibleHeaders.cus_name),
      tax_no: findValue(possibleHeaders.tax_no),
      email: findValue(possibleHeaders.email),
      phone: findValue(possibleHeaders.phone),
      order_no: findValue(possibleHeaders.order_no),
      cus_address: findValue(possibleHeaders.cus_address)
    };
  }

  public async validateFile(fileOrBuffer: File | Buffer, mimeType?: string) {
    let buffer: ArrayBuffer;
    let type: string;

    if (fileOrBuffer instanceof File) {
      // Client-side: File object
      if (!this.validateFileSize(fileOrBuffer)) {
        throw new Error('File size exceeds 2MB limit');
      }
      type = fileOrBuffer.type;
      buffer = await fileOrBuffer.arrayBuffer();
    } else {
      // Server-side: Buffer
      if (!this.validateFileSize({ size: fileOrBuffer.length })) {
        throw new Error('File size exceeds 2MB limit');
      }
      type = mimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      buffer = fileOrBuffer.buffer.slice(
        fileOrBuffer.byteOffset,
        fileOrBuffer.byteOffset + fileOrBuffer.byteLength
      ) as ArrayBuffer;
    }

    // Validate file type
    if (!this.validateFileType(type)) {
      throw new Error('Invalid file format. Only .xlsx or .csv files are supported');
    }

    // Read and parse file
    const jsonData = await this.readFileBuffer(buffer);

    // Validate row count
    if (!this.validateRowCount(jsonData)) {
      throw new Error('File exceeds maximum limit of 1000 records');
    }

    // Map Excel rows to expected format
    const mappedData = jsonData.map(row => this.mapExcelRow(row));

    // Validate records
    const validationResult = this.validateRecords(mappedData);

    return {
      rows: validationResult.validatedRecords,
      summary: {
        totalRows: validationResult.totalRows,
        validRows: validationResult.validRows,
        invalidRows: validationResult.invalidRows,
      },
    };
  }

  public validateRecords(records: any[]) {
    return bulkInvoiceValidationService.validateRecords(records);
  }

  public async generateTemplate(): Promise<Blob> {
    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Define headers with user-friendly names
    const headers = [
      ['User Name', 'Customer Name', 'Tax Code', 'Email', 'Phone Number', 'Order Number', 'Address']
    ];

    // Create worksheet with headers
    const ws = XLSX.utils.aoa_to_sheet(headers);

    // Add column widths for better readability
    const colWidths = [
      { wch: 15 }, // User Name
      { wch: 20 }, // Customer Name
      { wch: 15 }, // Tax Code
      { wch: 25 }, // Email
      { wch: 15 }, // Phone Number
      { wch: 15 }, // Order Number
      { wch: 30 }, // Address
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, ws, 'Invoice Template');

    // Generate buffer
    const wbout = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Convert to blob
    return new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  }

  public async importRecords(records: ValidatedRecord[]) {
    // This would typically make an API call to import the records
    // For now, we'll simulate the import process
    const importedRecords = records.map((record, index) => ({
      ...record,
      id: `temp-${index}`,
      status: Math.random() > 0.1 ? 'success' : 'error', // Simulate 10% failure rate
    }));

    const successCount = importedRecords.filter(r => r.status === 'success').length;
    const failureCount = importedRecords.filter(r => r.status === 'error').length;

    return {
      records: importedRecords,
      totalRecords: records.length,
      successCount,
      failureCount,
    };
  }
}

export const bulkImportService = new BulkImportService();
