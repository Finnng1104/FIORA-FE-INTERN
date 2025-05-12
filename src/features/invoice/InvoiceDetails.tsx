import { useEffect, useState } from 'react';

interface Order {
  id: string;
  orderNo: string;
  cusName: string;
  address: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface InvoiceDetails {
  id: string;
  cusName: string;
  date: string;
  totalAmount: number;
  user: { name: string };
  creator: { name: string };
  updater: { name: string };
  orderInvoices: {
    order: Order;
  }[];
}

export default function InvoiceDetailsPage() {
  const [invoices, setInvoices] = useState<InvoiceDetails[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/invoice');
        const data = await res.json();
        if (Array.isArray(data)) setInvoices(data);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách hóa đơn:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) return <p>Đang tải danh sách hóa đơn...</p>;
  if (invoices.length === 0) return <p>Không có hóa đơn nào.</p>;

  return (
    <div className="space-y-6 p-4">
      <h3 className="text-2xl font-bold text-center text-gray-800">Danh sách hóa đơn</h3>
      {invoices.map((invoice, index) => (
        <div
          key={invoice.id || `invoice-${index}`}
          className="bg-white shadow-md rounded-lg p-6 space-y-4"
        >
          <h4 className="text-xl font-semibold text-gray-700">Hóa đơn: {invoice.id}</h4>
          <p>
            <strong>Khách hàng:</strong> {invoice.cusName}
          </p>
          <p>
            <strong>Ngày:</strong> {new Date(invoice.date).toLocaleDateString()}
          </p>

          <div className="flex justify-between text-gray-600">
            <p>
              <strong>Người tạo:</strong> {invoice.creator?.name}
            </p>
            <p>
              <strong>Người cập nhật:</strong> {invoice.updater?.name}
            </p>
          </div>
          <p>
            <strong>Người dùng:</strong> {invoice.user?.name}
          </p>

          {invoice.orderInvoices && invoice.orderInvoices.length > 0 && (
            <div className="space-y-4">
              <p className="font-semibold text-lg">Thông tin đơn hàng:</p>
              {invoice.orderInvoices.map((orderInvoice, idx) => (
                <div
                  key={orderInvoice.order?.id || `order-${index}-${idx}`}
                  className="bg-gray-50 p-4 rounded-md shadow-sm"
                >
                  <p>
                    <strong>Đơn hàng:</strong> {orderInvoice.order?.orderNo} -{' '}
                    <strong>Ngày:</strong>{' '}
                    {new Date(orderInvoice.order?.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Tên khách hàng:</strong> {orderInvoice.order?.cusName}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> {orderInvoice.order?.address}
                  </p>
                  <p>
                    <strong>Email:</strong> {orderInvoice.order?.email}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {orderInvoice.order?.phone}
                  </p>
                </div>
              ))}
            </div>
          )}

          <p className="font-bold text-right text-lg">
            <strong>Tổng cộng:</strong>{' '}
            {isNaN(invoice.totalAmount) ? 'N/A' : invoice.totalAmount.toLocaleString()} VND
          </p>
        </div>
      ))}
    </div>
  );
}
