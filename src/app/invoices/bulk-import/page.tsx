import { Suspense } from 'react';
import BulkImportPageClient from '@/features/invoices/presentation/BulkImportPageClient';

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    }>
      <BulkImportPageClient />
    </Suspense>
  );
}

export const metadata = {
  title: 'Bulk Import Invoices',
  description: 'Upload multiple invoices at once using our bulk import feature.',
};
