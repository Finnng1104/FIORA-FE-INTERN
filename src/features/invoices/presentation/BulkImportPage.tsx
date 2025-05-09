import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BulkImportWizard } from './organisms/BulkImportWizard/BulkImportWizard';
import { UploadIcon } from '@/components/shared/icons';

export default function BulkImportPage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Bulk Import Invoices</h1>
        <p className="text-xl text-muted-foreground">
          Upload multiple invoices at once using our bulk import feature.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-card rounded-xl p-8 border shadow-sm">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <UploadIcon className="h-10 w-10 text-primary" />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Start Your Bulk Import
            </h2>
            <p className="text-muted-foreground text-lg">
              Download our template, fill it with your invoice data, and upload it to import multiple invoices at once.
            </p>
          </div>

          <Button
            size="lg"
            className="h-16 px-12 text-lg rounded-lg"
            onClick={() => setIsWizardOpen(true)}
          >
            Start Import Process
          </Button>
        </div>
      </div>

      {/* Import Wizard */}
      <BulkImportWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
    </div>
  );
}
