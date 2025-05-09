'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export type ImportStep = 'upload' | 'review' | 'import' | 'acknowledge';

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

interface ValidationData {
  records: ValidatedRecord[];
  totalRecords: number;
  successCount: number;
  failureCount: number;
}

interface ValidationResponse {
  rows: ValidatedRecord[];
  summary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
  };
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export function useBulkInvoiceImport() {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState<ImportStep>('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationData, setValidationData] = useState<ValidationData | null>(null);

  const reset = () => {
    setCurrentStep('upload');
    setIsLoading(false);
    setError(null);
    setValidationData(null);
  };

  const validateFile = async (file: File, appendData: boolean = false) => {
    if (!file) {
      setError('No file selected');
      return;
    }

    if (!session) {
      setError('Please sign in to continue');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/invoices/bulk-import/validate', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json() as ApiResponse<ValidationResponse>;

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to validate file');
      }

      const validationResponse = data.data!;
      
      if (appendData && validationData) {
        // Combine existing and new records
        const combinedRecords = [
          ...validationData.records,
          ...validationResponse.rows
        ];

        const validCount = combinedRecords.filter(r => r.status === 'valid').length;
        
        setValidationData({
          records: combinedRecords,
          totalRecords: combinedRecords.length,
          successCount: validCount,
          failureCount: combinedRecords.length - validCount,
        });
      } else {
        setValidationData({
          records: validationResponse.rows,
          totalRecords: validationResponse.summary.totalRows,
          successCount: validationResponse.summary.validRows,
          failureCount: validationResponse.summary.invalidRows,
        });
      }

      setCurrentStep('review');
    } catch (err) {
      console.error('Validation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to validate file');
    } finally {
      setIsLoading(false);
    }
  };

  const importData = async () => {
    if (!validationData?.records) {
      setError('No validation data available');
      return;
    }

    if (!session) {
      setError('Please sign in to continue');
      return;
    }

    const validRecords = validationData.records.filter(r => r.status === 'valid');
    
    if (validRecords.length === 0) {
      setError('No valid records to import');
      return;
    }

    setCurrentStep('import');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/invoices/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          records: validRecords,
        }),
      });

      const data = await response.json() as ApiResponse<ValidationData>;

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to import data');
      }

      setValidationData(data.data!);
      setCurrentStep('acknowledge');
    } catch (err) {
      console.error('Import error:', err);
      setError(err instanceof Error ? err.message : 'Failed to import data');
      setCurrentStep('review');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentStep,
    isLoading,
    error,
    validationData,
    validateFile,
    importData,
    reset,
  };
}
