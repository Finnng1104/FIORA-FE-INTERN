// app/invoice-details/page.tsx
'use client';

import InvoiceDashboard from '@/features/dashboard/dashboard';

export default function InvoiceDashboardPage() {
  return (
    <div className="flex flex-col p-4 space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight">D</h2>
      <InvoiceDashboard />
    </div>
  );
}
