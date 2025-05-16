import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import sgMail from '@sendgrid/mail';

const prisma = new PrismaClient();
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ error: 'Missing orderId' });

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true, // lấy thông tin user
      },
    });

    if (!order || !order.user) return res.status(404).json({ error: 'Order or user not found' });
    if (!order.user.email) return res.status(400).json({ error: 'Customer email is missing' });

    const emailContent = `
      <p>Xin chào <strong>${order.cusName}</strong>,</p>
      <p>Chúng tôi xin gửi tới bạn thông tin hóa đơn cho đơn hàng <strong>#${order.orderNo}</strong>.</p>
      <ul>
        <li><strong>Mã hóa đơn:</strong> ${order.orderNo}</li>
        <li><strong>Ngày đặt hàng:</strong> ${order.datetime?.toLocaleString('vi-VN') ?? 'Chưa xác định'}</li>
        <li><strong>Tổng tiền:</strong> ${Number(order.totalAmt).toLocaleString('vi-VN')} VND</li>
        <li><strong>Địa chỉ:</strong> ${order.address || 'Không có'}</li>
        <li><strong>Số điện thoại:</strong> ${order.phone || 'Không có'}</li>
      </ul>
      <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
    `;

    await sgMail.send({
      to: order.user.email,
      from: process.env.SENDER_EMAIL!,
      subject: `Hóa đơn đơn hàng #${order.orderNo}`,
      html: emailContent,
    });

    return res.status(200).json({ message: 'Email hóa đơn đã được gửi thành công!' });
  } catch (err: any) {
    console.error('Lỗi gửi mail:', err.response?.body || err.message);
    return res.status(500).json({ error: 'Lỗi gửi hóa đơn qua email' });
  }
}
