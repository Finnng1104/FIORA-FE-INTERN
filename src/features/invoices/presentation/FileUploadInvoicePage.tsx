'use client';

import Header from '@/features/landing/presentation/components/Header';
import UploadIssuedInvoice from '../uploadfile-invoice/UploadIssuedInvoice';
import UploadedFilesList from '../uploadfile-invoice/UploadedFilesList';
import Footer from '@/features/landing/presentation/components/Footer';
import { useEffect, useState } from 'react';

const UploadFileInvoice = () => {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);

  // Hàm lấy danh sách file từ API
  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/uploadfile-invoices/list');
      const data = await res.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Lỗi khi fetch files:', error);
    }
  };

  // Lấy danh sách file khi component được load
  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <>
      <Header />
      <div className="mt-20 p-10">
        <UploadIssuedInvoice onUploadSuccess={fetchFiles} />
        <UploadedFilesList files={files} setFiles={setFiles} />
      </div>
      <Footer />
    </>
  );
};

export default UploadFileInvoice;
