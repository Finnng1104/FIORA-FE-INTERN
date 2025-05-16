'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Order {
  id: string;
  orderNo: string;
  cusName: string;
  email: string;
  totalAmt: number;
  status: string;
  datetime: string;
}

export default function InvoiceNotificationPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Gọi API lấy danh sách đơn hàng
    axios.get('/api/orders').then((res) => setOrders(res.data));
  }, []);

  const handleSendInvoice = async (orderId: string) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/invoices/send', { orderId });
      alert(response.data.message);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Lỗi gửi email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Thông báo hóa đơn</h2>
      <table>
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Email</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Gửi hóa đơn</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.orderNo}</td>
              <td>{order.cusName}</td>
              <td>{order.email}</td>
              <td>{Number(order.totalAmt).toLocaleString('vi-VN')} VND</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => handleSendInvoice(order.id)} disabled={loading}>
                  {loading ? 'Đang gửi...' : 'Gửi'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
