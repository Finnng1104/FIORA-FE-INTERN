import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckIcon } from '@/components/shared/icons';

interface AcknowledgeStepProps {
  data: {
    totalRecords: number;
    successCount: number;
    failureCount: number;
  };
  onClose: () => void;
}

export function AcknowledgeStep({ data, onClose }: AcknowledgeStepProps) {
  const { totalRecords, successCount, failureCount } = data;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-8">
      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
        <CheckIcon className="h-10 w-10 text-green-600" />
      </div>

      {/* Success Message */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-green-600">
          Import Complete!
        </h3>
        <p className="text-lg text-muted-foreground">
          Your data has been successfully imported.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 w-full max-w-2xl">
        <SummaryCard
          title="Total Records"
          value={totalRecords}
          className="bg-muted/20"
        />
        <SummaryCard
          title="Successfully Imported"
          value={successCount}
          className="bg-green-500/10 text-green-600"
        />
        <SummaryCard
          title="Failed to Import"
          value={failureCount}
          className="bg-red-500/10 text-red-600"
        />
      </div>

      {/* Action Button */}
      <Button
        onClick={onClose}
        size="lg"
        className="h-16 px-12 text-lg rounded-lg mt-8"
      >
        Close
      </Button>
    </div>
  );
}

function SummaryCard({ title, value, className = '' }: { title: string; value: number; className?: string }) {
  return (
    <div className={`p-6 rounded-xl ${className}`}>
      <h4 className="text-base font-medium mb-2">{title}</h4>
      <p className="text-3xl font-semibold">{value}</p>
    </div>
  );
}
