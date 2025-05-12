// app/invoice-details/page.tsx
'use client';

import NextPrevious from '@/features/invoice/InvoiceDetails';

export default function InvoiceDetailsPage() {
  return (
    <div className="flex flex-col p-4 space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Chi tiết hóa đơn</h2>
      <NextPrevious />
    </div>
  );
}
