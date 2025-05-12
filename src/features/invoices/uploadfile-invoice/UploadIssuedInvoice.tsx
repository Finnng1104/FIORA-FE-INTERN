'use client';
import { useState } from 'react';

export default function UploadInvoice({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadVisible, setIsUploadVisible] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const VALID_FILE_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/zip',
    'application/xml',
  ];

  const handleUpload = async () => {
    if (!file) {
      setMessage('Vui lòng chọn một file để tải lên.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB.');
      setFile(null);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/uploadfile-invoices/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        setMessage('Tải lên thành công!');
        setFile(null);
        setPreviewUrl(null);
        setIsUploadVisible(false);
        if (onUploadSuccess) onUploadSuccess();
      } else {
        setMessage('Lỗi: ' + result.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Lỗi kết nối với máy chủ.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      if (!VALID_FILE_TYPES.includes(selectedFile.type)) {
        setMessage('File không hợp lệ. Vui lòng chọn file PDF, hình ảnh hoặc file zip.');
        setFile(null);
        setPreviewUrl(null);
        return;
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        setMessage('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB.');
        setFile(null);
        setPreviewUrl(null);
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl mb-2">Tải lên hóa đơn phát hành</h2>
      <button
        onClick={() => setIsUploadVisible(!isUploadVisible)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isUploadVisible ? 'Ẩn Tải Lên' : 'Hiện Tải Lên'}
      </button>

      {isUploadVisible && (
        <div className="mt-4">
          <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.zip,.xml" />
          {previewUrl && (
            <div className="mt-2">
              <img src={previewUrl} alt="Preview" className="max-w-xs h-auto" />
            </div>
          )}
          <button
            onClick={handleUpload}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Upload
          </button>
          {message && <p className="mt-2 text-green-600">{message}</p>}
        </div>
      )}
    </div>
  );
}
