import { useState } from 'react';
import { InvoiceDetails } from '@/features/invoice/domain/entities/invoice';

export function useInvoiceNavigation(invoices: InvoiceDetails[]) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasNext = currentIndex < invoices.length - 1;
  const hasPrev = currentIndex > 0;

  const next = () => {
    if (hasNext) setCurrentIndex((prev) => prev + 1);
  };

  const prev = () => {
    if (hasPrev) setCurrentIndex((prev) => prev - 1);
  };

  return {
    currentInvoice: invoices[currentIndex],
    currentIndex,
    hasNext,
    hasPrev,
    next,
    prev,
  };
}
