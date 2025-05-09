import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertIcon, CheckIcon, XIcon, UploadIcon, PlusIcon } from '@/components/shared/icons';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ReviewStepProps {
  data: {
    records: any[];
    totalRecords: number;
    successCount: number;
    failureCount: number;
  };
  onImport: () => void;
  onReset: () => void;
  onAddMore: () => void;
  error?: string | null;
}
export function ReviewStep({ data, onImport, onReset, onAddMore, error }: ReviewStepProps) {
  const { records, totalRecords, successCount, failureCount } = data;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        <SummaryCard
          title="Total Records"
          value={totalRecords}
          className="bg-muted/20"
        />
        <SummaryCard
          title="Valid Records"
          value={successCount}
          className="bg-green-500/10 text-green-600"
        />
        <SummaryCard
          title="Invalid Records"
          value={failureCount}
          className="bg-red-500/10 text-red-600"
        />
      </div>

      {/* File Actions */}
      <div className="flex items-center space-x-4 justify-between">
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={onReset}
            className="h-10 px-4"
          >
            <UploadIcon className="h-4 w-4 mr-2" />
            Choose New File
          </Button>
          <Button
            variant="outline"
            onClick={onAddMore}
            className="h-10 px-4"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add More Records
          </Button>
        </div>
        <Button
          onClick={onImport}
          size="sm"
          className="h-8 px-4 text-sm rounded-md"
          disabled={successCount === 0}
        >
          Import {successCount} Valid Records
        </Button>
      </div>

      {/* Records Table */}
      <div className="border rounded-xl overflow-hidden">
        <div className="overflow-y-auto max-h-[500px]">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0">
              <TableRow>
                <TableHead className="w-14 text-center">No.</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Tax Code</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Order No.</TableHead>
                <TableHead className="w-20 text-center">Status</TableHead>
                <TableHead className="w-64">Issues</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record, index) => (
                <TableRow key={index} className={`group ${record.status === 'invalid' ? 'bg-red-50/50' : ''}`}>
                  <TableCell className="text-center font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>{record.user_name}</TableCell>
                  <TableCell>{record.cus_name}</TableCell>
                  <TableCell>{record.tax_no}</TableCell>
                  <TableCell>{record.email}</TableCell>
                  <TableCell>{record.phone}</TableCell>
                  <TableCell>{record.order_no}</TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      {record.status === 'valid' ? (
                        <CheckIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <XIcon className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.status === 'invalid' && (
                      <div className="text-red-500 text-sm space-y-1">
                        {record.errors?.map((error: any, i: number) => (
                          <div key={i} className="flex items-start">
                            <XIcon className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" />
                            <span>{error.message}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end items-center space-x-4">
        <Button
          onClick={onAddMore}
          variant="outline"
          size="sm"
          className="h-10 px-5 text-sm rounded-md"
        >
          Add More Records
        </Button>
        <Button
          onClick={onImport}
          size="sm"
          className="h-10 px-5 text-sm rounded-md"
          disabled={successCount === 0}
        >
          Import {successCount} Valid Records
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/5 text-destructive px-6 py-4 rounded-lg flex items-start">
          <AlertIcon className="h-6 w-6 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-base">{error}</p>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, className = '' }: { title: string; value: number; className?: string }) {
  return (
    <div className={`p-6 rounded-xl ${className}`}>
      <h4 className="text-lg font-medium mb-2">{title}</h4>
      <p className="text-3xl font-semibold">{value}</p>
    </div>
  );
}
