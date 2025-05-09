import { z } from 'zod';

export const BulkInvoiceRowSchema = z.object({
  user_name: z.string().min(1, 'User name is required'),
  cus_name: z.string().min(1, 'Customer name is required'),
  tax_no: z.string()
    .regex(/^\d{10}(\d{3})?$/, 'Tax number must be 10 or 13 digits')
    .min(1, 'Tax number is required'),
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required'),
  phone: z.string()
    .regex(/^0\d{9}$/, 'Phone number must be a 10-digit Vietnamese number starting with 0')
    .min(1, 'Phone number is required'),
  order_no: z.string().min(1, 'Order number is required'),
  cus_address: z.string().min(1, 'Customer address is required'),
});

export type BulkInvoiceRow = z.infer<typeof BulkInvoiceRowSchema>;

export interface BulkInvoiceValidationError {
  rowIndex: number;
  field: string;
  message: string;
}

export interface BulkImportResult {
  totalRows: number;
  validRows: number;
  errors: BulkInvoiceValidationError[];
  importedInvoices: string[];
}

export interface BulkImportSummary {
  totalRecords: number;
  successCount: number;
  failureCount: number;
  records: Array<{
    id?: string;
    status: 'success' | 'error';
    message?: string;
  }>;
  validationSummary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    errors: BulkInvoiceValidationError[];
  };
}
