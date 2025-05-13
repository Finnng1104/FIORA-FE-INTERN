import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Truy vấn tất cả các hóa đơn có trạng thái 'Requested'
      const invoices = await prisma.invoice.findMany({
        where: {
          status: 'Requested',
        },
        select: {
          id: true,
          reqNo: true,
          cusName: true,
          status: true,
          invDate: true,
        },
      });

      res.status(200).json(invoices);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Lỗi khi truy vấn dữ liệu hóa đơn' });
    }
  } else {
    res.status(405).json({ error: 'Phương thức không được phép' });
  }
}
