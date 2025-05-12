'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Download, RotateCcw } from 'lucide-react';
import { BulkProcessSummary } from '@/app/(home)/bulk-request-invoice/page';

export interface ProcessedInvoiceRequest {
  rowNumber?: number;
  data?: Record<string, any>; // Or a more specific type for row data
  errorMessage: string;
  // Add any other relevant fields for a processed/failed request
}

interface BulkInvoiceResultsDisplayProps {
  summary: BulkProcessSummary;
  onCreateNewBulk: () => void;
}

export function BulkInvoiceResultsDisplay({
  summary,
  onCreateNewBulk,
}: BulkInvoiceResultsDisplayProps) {
  const handleDownloadErrorReport = () => {
    if (!summary.errors || summary.errors.length === 0) {
      alert('No errors to report.');
      return;
    }

    const csvHeader = [
      'RowNumber',
      'OrderNo',
      'CustomerName',
      'TaxNo',
      'TaxAddress',
      'Email',
      'Phone',
      'ErrorMessage',
    ];
    const csvRows = summary.errors.map((error) => {
      const rowData = error.data || {};
      const escapedErrorMessage = `"${error.errorMessage.replace(/"/g, '""')}"`;
      // Ensure each element is a string and then join
      return [
        String(error.rowNumber || 'N/A'),
        String(rowData.OrderNo || ''),
        String(rowData.CustomerName || ''),
        String(rowData.TaxNo || ''),
        String(rowData.TaxAddress || ''),
        String(rowData.Email || ''),
        String(rowData.Phone || ''),
        escapedErrorMessage,
      ].join(',');
    });

    const csvContent = [csvHeader.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'bulk_invoice_error_report.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const hasErrors = summary.failedRequests > 0;
  const hasSuccesses = summary.successfulRequests > 0;

  return (
    <div className="space-y-6">
      {hasErrors && !hasSuccesses && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Processing Failed</AlertTitle>
          <AlertDescription>
            None of the invoice requests could be processed. Please check the error report.
          </AlertDescription>
        </Alert>
      )}
      {!hasErrors && hasSuccesses && (
        <Alert className="border-green-500 text-green-700 dark:border-green-700 dark:text-green-400">
          <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
          <AlertTitle className="text-green-700 dark:text-green-400">
            Processing Successful
          </AlertTitle>
          <AlertDescription>
            All {summary.successfulRequests} invoice requests were processed successfully.
          </AlertDescription>
        </Alert>
      )}
      {hasErrors && hasSuccesses && (
        <Alert className="border-yellow-500 text-yellow-700 dark:border-yellow-600 dark:text-yellow-400">
          <AlertTriangle className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
          <AlertTitle className="text-yellow-700 dark:text-yellow-400">
            Processing Partially Successful
          </AlertTitle>
          <AlertDescription>
            {summary.successfulRequests} of {summary.totalRows} requests were successful.{' '}
            {summary.failedRequests} requests had errors.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Processing Summary</CardTitle>
          <CardDescription>Overview of the bulk invoice request processing.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
            <p className="text-3xl font-bold">{summary.totalRows}</p>
            <p className="text-sm text-muted-foreground">Total Rows in File</p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-green-50 dark:bg-green-900/30">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {summary.successfulRequests}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">Successful Requests</p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-red-50 dark:bg-red-900/30">
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              {summary.failedRequests}
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">Failed Requests</p>
          </div>
        </CardContent>
      </Card>

      {hasErrors && summary.errors && summary.errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Error Details</CardTitle>
            <CardDescription>
              List of requests that failed processing. Review the errors and correct your file.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Row No.</TableHead>
                    <TableHead>Order Number</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Error Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.errors.map((error, index) => (
                    <TableRow key={index}>
                      <TableCell>{error.rowNumber || 'N/A'}</TableCell>
                      <TableCell>{error.data?.OrderNo || '-'}</TableCell>
                      <TableCell>{error.data?.CustomerName || '-'}</TableCell>
                      <TableCell className="text-red-600">{error.errorMessage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              variant="outline"
              onClick={handleDownloadErrorReport}
              aria-label="Download error report"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Error Report (CSV)
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="flex justify-center mt-8">
        <Button onClick={onCreateNewBulk} aria-label="Create new bulk invoice request">
          <RotateCcw className="mr-2 h-4 w-4" />
          Create New Bulk Invoice Request
        </Button>
      </div>
    </div>
  );
}
