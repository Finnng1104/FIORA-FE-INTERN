import { InvoiceDetails } from '@/features/invoice/domain/entities/invoice';

export async function fetchInvoices(): Promise<InvoiceDetails[]> {
  const res = await fetch('/api/invoice');
  if (!res.ok) throw new Error('Lỗi khi fetch hóa đơn');
  return res.json();
}
