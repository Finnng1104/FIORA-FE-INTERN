'use client';

import React from 'react';
import { LoadingStepProps } from '@/features/invoices/domain/types/bulk-import.types';

const LoadingStep: React.FC<LoadingStepProps> = ({ isLoading, error }) => {
  if (!isLoading && error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-red-500 mb-4">
          <svg
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
        <p className="text-sm text-gray-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Processing</h3>
      <p className="text-sm text-gray-500">Please wait while we process your request...</p>
    </div>
  );
};

export default LoadingStep;
