import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { email, invoiceNumber } = req.body;

  if (!email || !invoiceNumber) {
    return res.status(400).json({ message: 'Thiếu thông tin email hoặc số hóa đơn' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email không hợp lệ' });
  }

  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASS) {
    return res.status(500).json({ message: 'Cấu hình email chưa được thiết lập' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Hệ thống" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: `Hóa đơn ${invoiceNumber}`,
      text: `Hóa đơn ${invoiceNumber} đã được xuất.`,
    });

    return res.status(200).json({ message: 'Gửi email thành công' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ message: 'Gửi email thất bại, vui lòng thử lại sau.' });
  }
}
