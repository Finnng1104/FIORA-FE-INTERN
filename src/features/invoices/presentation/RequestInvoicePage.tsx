'use client';

import Header from '@/features/landing/presentation/components/Header';
import RequestInvoiceForm from './organisms/RequestInvoiceForm';
import Footer from '@/features/landing/presentation/components/Footer';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Slash } from 'lucide-react';

const RequestInvoicePage = () => {
  return (
    <>
      <Header />
      <div className="mt-20 p-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Landing Page</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Request Invoice</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <RequestInvoiceForm />
      </div>
      <Footer />
    </>
  );
};

export default RequestInvoicePage;
