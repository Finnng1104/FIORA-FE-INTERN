'use client';

import dynamic from 'next/dynamic';
import { Loading } from '@/components/common/atoms';

const FileUploadInvoicePage = dynamic(
  () => import('@/features/invoices/presentation/FileUploadInvoicePage'),
  {
    loading: () => <Loading />,
    ssr: false,
  },
);
export default function RequestInvoice() {
  return <FileUploadInvoicePage />;
}
