import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Đường dẫn tới thư mục chứa file tải lên
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { filename } = req.query;

    // Kiểm tra xem tên file có hợp lệ không
    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ message: 'Tên file không hợp lệ' });
    }

    // Đường dẫn đầy đủ tới file cần xóa
    const filePath = path.join(UPLOAD_DIR, filename);

    // Kiểm tra xem file có tồn tại không
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File không tìm thấy' });
    }

    // Thực hiện xóa file
    try {
      fs.unlinkSync(filePath); // Xóa file
      return res.status(200).json({ message: 'Xóa file thành công' });
    } catch (error) {
      console.error('Lỗi khi xóa file:', error);
      return res.status(500).json({ message: 'Xảy ra lỗi khi xóa file' });
    }
  } else {
    // Chỉ chấp nhận phương thức DELETE
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
