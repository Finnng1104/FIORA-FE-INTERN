import React from 'react';
import { LoadingIcon } from '@/components/shared/icons';

interface ImportStepProps {
  error?: string | null;
}

export function ImportStep({ error }: ImportStepProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      {error ? (
        <p className="text-destructive text-lg font-semibold">{error}</p>
      ) : (
        <>
          <LoadingIcon className="h-16 w-16 text-primary animate-spin" />
          <p className="text-lg font-medium">Importing data, please wait...</p>
        </>
      )}
    </div>
  );
}
