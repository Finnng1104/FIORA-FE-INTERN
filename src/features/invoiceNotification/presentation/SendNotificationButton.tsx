'use client';

import { useSendInvoiceNotification } from '../application/hooks/useSendInvoiceNotification';

export function SendNotificationButton() {
  const { send, loading, success, error } = useSendInvoiceNotification();

  const handleClick = () => {
    send('ngdvuong205@gmail.com', 'INV-2025-001');
  };

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Đang gửi...' : 'Gửi thông báo hóa đơn'}
      </button>
      {success && <p style={{ color: 'green' }}>✅ Gửi thành công!</p>}
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}
    </div>
  );
}
