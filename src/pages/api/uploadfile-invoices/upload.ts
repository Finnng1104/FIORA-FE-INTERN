import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Files } from 'formidable';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

// Cấu hình API để tắt bodyParser mặc định của Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Danh sách các định dạng file cho phép
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/zip',
  'application/xml',
  'application/x-rar-compressed', // Thêm hỗ trợ tệp .rar
];

// Hàm xử lý tải file
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const form = formidable({
    uploadDir: UPLOAD_DIR,
    keepExtensions: true,
    maxFileSize: MAX_FILE_SIZE,
    multiples: false, // Chỉ cho phép tải lên 1 file
  });

  form.parse(req, async (err, fields, files: Files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ message: 'Lỗi khi xử lý file' });
    }

    const uploadedFile = files['file'];
    if (!uploadedFile) {
      return res.status(400).json({ message: 'Không có file được tải lên' });
    }

    const file = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;
    console.log('File received:', file.originalFilename);

    if (!ALLOWED_FILE_TYPES.includes(file.mimetype || '')) {
      fs.unlinkSync(file.filepath); // Xóa file không hợp lệ
      return res.status(400).json({ message: 'Định dạng file không hợp lệ' });
    }

    if (
      file.mimetype === 'application/zip' ||
      file.mimetype === 'application/x-zip-compressed' ||
      file.mimetype === 'application/x-rar-compressed' // Hỗ trợ file .rar
    ) {
      try {
        const zip = new AdmZip(file.filepath);
        const entries = zip.getEntries();

        const validEntries = entries.filter((entry) => /\.(pdf|xml)$/i.test(entry.entryName));

        if (validEntries.length < 1 || validEntries.length > 2) {
          fs.unlinkSync(file.filepath); // Xóa file zip không hợp lệ
          return res.status(400).json({
            message: 'File .zip phải chứa 1–2 file định dạng .pdf hoặc .xml',
          });
        }

        const tempExtractPath = path.join(UPLOAD_DIR, 'unzipped', Date.now().toString());
        fs.mkdirSync(tempExtractPath, { recursive: true });

        zip.extractAllTo(tempExtractPath, true);

        return res.status(200).json({
          message: 'Tải lên và kiểm tra file .zip thành công',
          extractedFiles: validEntries.map((e) => e.entryName),
        });
      } catch (zipErr) {
        console.error('Zip extraction error:', zipErr);
        fs.unlinkSync(file.filepath);
        return res.status(500).json({ message: 'Lỗi khi giải nén file .zip' });
      }
    }

    return res.status(200).json({
      message: 'Tải lên thành công',
      filename: file.originalFilename,
    });
  });
}
