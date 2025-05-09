interface ValidationError {
  field: string;
  message: string;
}

interface ValidatedRecord {
  user_name: string;
  cus_name: string;
  tax_no: string;
  email: string;
  phone: string;
  order_no: string;
  cus_address: string;
  status: 'valid' | 'invalid';
  errors?: ValidationError[];
}

interface ValidationResult {
  validatedRecords: ValidatedRecord[];
  totalRows: number;
  validRows: number;
  invalidRows: number;
}

class BulkInvoiceValidationService {
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePhoneNumber(phone: string): boolean {
    // Vietnamese phone number format: 10 digits starting with 0
    const phoneRegex = /^0\d{9}$/;
    // Remove any spaces, dashes, or parentheses before validation
    const cleanPhone = phone.replace(/[\s()-]/g, '');
    return phoneRegex.test(cleanPhone);
  }

  private validateTaxNumber(taxNo: string): boolean {
    // Tax number format: 10-13 digits
    const cleanTaxNo = taxNo.replace(/[\s-]/g, '');
    return cleanTaxNo.length >= 10 && cleanTaxNo.length <= 13 && /^\d+$/.test(cleanTaxNo);
  }

  private validateRequiredField(value: string, fieldName: string): ValidationError | null {
    if (!value || value.trim() === '') {
      return {
        field: fieldName,
        message: `${fieldName} is required`,
      };
    }
    return null;
  }

  private validateRecord(record: any): ValidatedRecord {
    const errors: ValidationError[] = [];

    // Required fields validation
    const requiredFields = [
      { key: 'user_name', label: 'User Name' },
      { key: 'cus_name', label: 'Customer Name' },
      { key: 'tax_no', label: 'Tax Code' },
      { key: 'phone', label: 'Phone Number' },
      { key: 'order_no', label: 'Order Number' },
    ];

    for (const field of requiredFields) {
      const error = this.validateRequiredField(record[field.key], field.label);
      if (error) errors.push(error);
    }

    // Tax number validation (if provided)
    if (record.tax_no) {
      if (!this.validateTaxNumber(record.tax_no)) {
        errors.push({
          field: 'tax_no',
          message: 'Tax Code must be between 10-13 digits',
        });
      }
    }

    // Phone number validation (if provided)
    if (record.phone) {
      if (!this.validatePhoneNumber(record.phone)) {
        errors.push({
          field: 'phone',
          message: 'Invalid phone number format (must be 10 digits starting with 0)',
        });
      }
    }

    // Email validation (if provided)
    if (record.email && !this.validateEmail(record.email)) {
      errors.push({
        field: 'email',
        message: 'Invalid email format',
      });
    }

    // Clean and format the data
    const validatedRecord: ValidatedRecord = {
      user_name: record.user_name?.trim() || '',
      cus_name: record.cus_name?.trim() || '',
      tax_no: record.tax_no?.replace(/[\s-]/g, '') || '',
      email: record.email?.trim() || '',
      phone: record.phone?.replace(/[\s()-]/g, '') || '',
      order_no: record.order_no?.trim() || '',
      cus_address: record.cus_address?.trim() || '',
      status: errors.length === 0 ? 'valid' : 'invalid',
      errors: errors.length > 0 ? errors : undefined,
    };

    return validatedRecord;
  }

  public validateRecords(records: any[]): ValidationResult {
    const validatedRecords = records.map(record => this.validateRecord(record));
    const validRows = validatedRecords.filter(record => record.status === 'valid').length;

    return {
      validatedRecords,
      totalRows: records.length,
      validRows,
      invalidRows: records.length - validRows,
    };
  }
}

export const bulkInvoiceValidationService = new BulkInvoiceValidationService();
