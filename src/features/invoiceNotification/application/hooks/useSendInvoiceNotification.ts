import { useState } from 'react';
import { sendInvoiceNotification } from '../../infrastructure/sendInvoiceNotification';

export function useSendInvoiceNotification() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (email: string, invoiceNumber: string) => {
    setLoading(true);
    setError(null);
    try {
      await sendInvoiceNotification(email, invoiceNumber);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Gửi thông báo thất bại');
    } finally {
      setLoading(false);
    }
  };

  return { send, loading, success, error };
}
