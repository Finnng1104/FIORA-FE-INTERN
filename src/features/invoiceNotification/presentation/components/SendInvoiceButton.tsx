'use client';
import { useState } from 'react';
import axios from 'axios';

interface Props {
  orderId: string;
}

export const SendInvoiceButton = ({ orderId }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    try {
      setLoading(true);
      const res = await axios.post('/api/invoices/send', { orderId });
      alert(res.data.message);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Lỗi gửi email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleSend} disabled={loading}>
      {loading ? 'Đang gửi...' : 'Gửi hóa đơn'}
    </button>
  );
};
