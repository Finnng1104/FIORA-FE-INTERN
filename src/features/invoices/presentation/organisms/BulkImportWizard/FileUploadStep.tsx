import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { FileIcon, UploadIcon, XIcon } from '@/components/shared/icons';

interface FileUploadStepProps {
  onFileSelect: (file: File) => void;
  error?: string | null;
}

export function FileUploadStep({ onFileSelect, error }: FileUploadStepProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const downloadTemplate = async () => {
    try {
      const response = await fetch('/api/invoices/bulk-import/template', {
        credentials: 'include',
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bulk-invoice-template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download template:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Template Download Section */}
      <div className="bg-muted/20 p-8 rounded-xl">
        <h3 className="text-xl font-semibold mb-3">1. Download Template</h3>
        <p className="text-muted-foreground mb-6 text-lg">
          Start by downloading our template file to ensure your data is formatted correctly.
        </p>
        <Button 
          onClick={downloadTemplate} 
          variant="outline" 
          size="lg"
          className="h-16 text-lg px-8 rounded-lg hover:bg-primary hover:text-primary-foreground"
        >
          <FileIcon className="mr-3 h-6 w-6" />
          Download Template
        </Button>
      </div>

      {/* File Upload Section */}
      <div>
        <h3 className="text-xl font-semibold mb-3">2. Upload Your File</h3>
        <div 
          {...getRootProps()} 
          className={`
            border-3 border-dashed rounded-xl p-12
            flex flex-col items-center justify-center
            min-h-[400px] cursor-pointer
            transition-all duration-200
            ${isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/5'}
            ${error ? 'border-destructive/50 bg-destructive/5' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <UploadIcon className="mx-auto h-16 w-16 text-muted-foreground/50 mb-6" />
            <h3 className="text-2xl font-medium mb-4">
              {isDragActive ? 'Drop the file here' : 'Upload Invoice File'}
            </h3>
            <p className="text-muted-foreground text-lg mb-6">
              Drag and drop your file here, or click to select
            </p>
            <div className="inline-block border border-muted-foreground/25 rounded-lg px-4 py-2">
              <p className="text-sm text-muted-foreground">
                Supported formats: .xlsx, .csv (max 2MB)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/5 text-destructive px-6 py-4 rounded-lg flex items-start">
          <XIcon className="h-6 w-6 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-base">{error}</p>
        </div>
      )}
    </div>
  );
}
