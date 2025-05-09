'use client';

import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { FileUploadStep } from './FileUploadStep';
import { ReviewStep } from './ReviewStep';
import { ImportStep } from './ImportStep';
import { AcknowledgeStep } from './AcknowledgeStep';
import { useBulkInvoiceImport } from '../../../presentation/hooks/useBulkInvoiceImport';

interface BulkImportWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulkImportWizard({ isOpen, onClose }: BulkImportWizardProps) {
  const {
    currentStep,
    isLoading,
    error,
    validationData,
    validateFile,
    importData,
    reset,
  } = useBulkInvoiceImport();

  // Create a ref for the file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose();
    }
  };

  const handleReset = () => {
    reset();
  };

  const handleAddMore = () => {
    // Trigger file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateFile(file, true); // true means append to existing data
    }
    // Reset the input value so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-[900px] w-[90vw] min-h-[80vh] p-0 gap-0"
        onInteractOutside={(e) => {
          // Prevent closing during loading states
          if (isLoading) {
            e.preventDefault();
          }
        }}
      >
        {/* Hidden file input for adding more records */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".xlsx,.csv"
          onChange={handleFileChange}
        />

        {/* Header */}
        <div className="p-6 border-b">
          <DialogTitle className="text-2xl font-semibold">
            Bulk Import Invoices
          </DialogTitle>
          <p className="text-muted-foreground mt-2">
            Upload multiple invoices at once using our bulk import feature. Download the template to ensure your data is formatted correctly.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b bg-muted/20">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <Step number={1} label="Drop File" active={currentStep === 'upload'} completed={currentStep !== 'upload'} />
            <Step number={2} label="Review" active={currentStep === 'review'} completed={currentStep === 'import' || currentStep === 'acknowledge'} />
            <Step number={3} label="Import Data" active={currentStep === 'import'} completed={currentStep === 'acknowledge'} />
            <Step number={4} label="Acknowledge" active={currentStep === 'acknowledge'} completed={false} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 min-h-[400px]">
          {currentStep === 'upload' && (
            <FileUploadStep onFileSelect={(file) => validateFile(file, false)} error={error} />
          )}
          {currentStep === 'review' && validationData && (
            <ReviewStep 
              data={validationData} 
              onImport={importData}
              onReset={handleReset}
              onAddMore={handleAddMore}
              error={error}
            />
          )}
          {currentStep === 'import' && (
            <ImportStep error={error} />
          )}
          {currentStep === 'acknowledge' && validationData && (
            <AcknowledgeStep 
              data={validationData}
              onClose={handleClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface StepProps {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}

function Step({ number, label, active, completed }: StepProps) {
  return (
    <div className="flex items-center">
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
        ${active ? 'bg-primary text-primary-foreground' : 
          completed ? 'bg-primary/20 text-primary' : 
          'bg-muted text-muted-foreground'}
      `}>
        {number}
      </div>
      <span className={`
        ml-3 text-sm font-medium
        ${active ? 'text-primary' : 
          completed ? 'text-primary/70' : 
          'text-muted-foreground'}
      `}>
        {label}
      </span>
    </div>
  );
}
