'use client';

interface UploadedFilesListProps {
  files: { name: string; url: string }[];
  setFiles: React.Dispatch<React.SetStateAction<{ name: string; url: string }[]>>; // Đảm bảo setFiles có kiểu đúng
}

const handleDelete = async (
  filename: string,
  setFiles: React.Dispatch<React.SetStateAction<{ name: string; url: string }[]>>,
) => {
  const confirmDelete = confirm(`Bạn có chắc muốn xóa file "${filename}"?`);
  if (!confirmDelete) return;

  try {
    const res = await fetch(`/api/uploadfile-invoices/delete?filename=${filename}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      // Cập nhật danh sách file sau khi xóa
      alert('Xóa file thành công');
      // Cập nhật state sau khi xóa file
      setFiles((prev) => prev.filter((file) => file.name !== filename));
    } else {
      const data = await res.json();
      console.log(filename);
      alert(`Lỗi khi xóa file: ${data.message}`);
    }
  } catch (error) {
    console.error('Lỗi khi gọi API xóa:', error);
    console.log(filename);
    alert('Xảy ra lỗi khi xóa file');
  }
};

export default function UploadedFilesList({ files, setFiles }: UploadedFilesListProps) {
  const isImage = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  return (
    <div className="mt-6 p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Danh sách file đã upload</h2>

      {files.length === 0 ? (
        <p className="text-gray-600">Chưa có file nào được upload.</p>
      ) : (
        <ul className="list-disc pl-6 space-y-2">
          {files.map((file: { name: string; url: string }, index: number) => (
            <li key={index} className="flex items-center space-x-2">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:underline"
              >
                {isImage(file.url) ? (
                  <img src={file.url} alt={file.name} className="w-16 h-16 object-cover rounded" />
                ) : (
                  <span className="text-blue-600 hover:text-blue-800 transition-all duration-300">
                    {file.name}
                  </span>
                )}
              </a>
              <span className="text-sm text-gray-500">({file.url.split('/').pop()})</span>
              <button
                onClick={() => handleDelete(file.name, setFiles)} // Truyền setFiles vào hàm
                className="text-red-600 hover:text-red-800 text-sm font-medium ml-4"
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
