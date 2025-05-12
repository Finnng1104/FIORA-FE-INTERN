import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  try {
    // Kiểm tra nếu thư mục uploads không tồn tại, tạo mới
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Lấy danh sách file trong thư mục uploads
    const files = fs.readdirSync(uploadsDir).map((filename) => ({
      name: filename,
      url: `/uploads/${filename}`, // Đảm bảo rằng đường dẫn đúng
    }));

    res.status(200).json({ files });
  } catch (error) {
    console.error('Lỗi đọc thư mục:', error);
    res.status(500).json({ error: 'Không thể đọc thư mục uploads.' });
  }
}
