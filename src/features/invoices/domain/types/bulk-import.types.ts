export type ImportStep = 'upload' | 'review' | 'import' | 'acknowledge';

export type ValidationStatus = 'valid' | 'invalid';
export type ImportStatus = 'success' | 'error';
export type RecordStatus = ValidationStatus | ImportStatus;

export interface ValidationError {
  field: string;
  message: string;
}

export interface BaseRecord {
  user_name: string;
  cus_name: string;
  tax_no: string;
  email: string;
  phone: string;
  order_no: string;
  cus_address: string;
  message?: string;
}

export interface ValidatedRecord extends BaseRecord {
  status: ValidationStatus;
  errors?: ValidationError[];
}

export interface ImportedRecord extends BaseRecord {
  id: string;
  status: ImportStatus;
}

export interface ValidationSummary {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: Array<{
    rowIndex: number;
    field: string;
    message: string;
  }>;
}

export interface BulkImportValidationResponse {
  rows: ValidatedRecord[];
  summary: ValidationSummary;
}

export interface BulkImportResponse {
  totalRecords: number;
  successCount: number;
  failureCount: number;
  records: ImportedRecord[];
}

// Component Props Types
export interface FileUploadStepProps {
  onFileSelect: (file: File) => void;
  onDownloadSample: () => void;
  isLoading: boolean;
  error?: string;
}

export interface ReviewStepProps {
  data: ValidatedRecord[];
  onCancel: () => void;
  onImport: () => void;
  isLoading: boolean;
  error?: string;
}

export interface ImportStepProps {
  isLoading: boolean;
  error?: string;
  onRetry: () => void;
}

export interface LoadingStepProps {
  isLoading: boolean;
  error?: string;
}

export interface AcknowledgeStepProps {
  summary: {
    totalRecords: number;
    successCount: number;
    failureCount: number;
  };
  onClose: () => void;
  error?: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
