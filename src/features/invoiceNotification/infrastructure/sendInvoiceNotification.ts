import { NextApiRequest, NextApiResponse } from 'next';
import { sendInvoiceNotification } from '../application/sendInvoiceNotification';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ error: 'Missing orderId' });

  try {
    await sendInvoiceNotification(orderId);
    return res.status(200).json({ message: 'Email hóa đơn đã được gửi thành công!' });
  } catch (error: any) {
    console.error('Lỗi gửi mail:', error);
    return res.status(500).json({ error: 'Lỗi gửi hóa đơn qua email' });
  }
}
