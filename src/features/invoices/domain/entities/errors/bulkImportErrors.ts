export const BULK_IMPORT_ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size exceeds 2MB limit',
  INVALID_FILE_TYPE: 'Only .xlsx or .csv files are supported',
  TOO_MANY_ROWS: 'File contains more than 1001 rows',
  INVALID_STRUCTURE: 'File structure does not match the required format',
  PROCESSING_ERROR: 'Error processing the import file',
  NO_RECORDS_IMPORTED: 'No records were successfully imported',
} as const;

export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileValidationError';
  }
}

export class BulkImportProcessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BulkImportProcessError';
  }
}
