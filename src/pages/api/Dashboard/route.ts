import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/pages/api/lib/prisma'; // Giả sử bạn đang sử dụng Prisma Client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Tính tổng số đơn hàng
    const totalOrders = await prisma.order.count();

    // Tính tổng doanh thu từ tổng số tiền trong các đơn hàng
    const totalRevenue = await prisma.order.aggregate({
      _sum: {
        totalAmt: true, // Tổng số tiền của các đơn hàng
      },
    });

    // Tính tổng số người dùng
    const totalUsers = await prisma.user.count();

    // Trả về kết quả
    return res.status(200).json({
      totalUsers, // Tổng số người dùng
      totalRevenue: totalRevenue._sum.totalAmt || 0, // Tổng doanh thu, nếu không có kết quả trả về 0
      totalOrders, // Tổng số đơn hàng
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error); // In lỗi ra console để dễ dàng debug
    return res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu.' });
  }
}
