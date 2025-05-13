'use client';

import { useEffect, useState } from 'react';

interface Section {
  id: string;
  name: string;
  order: number;
  section_type: string;
}

export default function SectionList() {
  const [sections, setSections] = useState<Section[]>([]);
  const [courseId, setCourseId] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSections = async (courseId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sections?courseId=${courseId}`);
      const data = await res.json();
      if (res.ok) {
        setSections(data);
      } else {
        console.error(data.error);
        setSections([]);
      }
    } catch (err) {
      console.error('Lỗi khi fetch section:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchSections(courseId);
    }
  }, [courseId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          placeholder="Nhập courseId..."
          className="border p-2 rounded w-full"
        />
        <button
          onClick={() => fetchSections(courseId)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Tìm
        </button>
      </div>

      {loading ? (
        <p>Đang tải danh sách section...</p>
      ) : (
        <ul className="list-disc pl-5">
          {sections.length > 0 ? (
            sections.map((section) => (
              <li key={section.id}>
                <strong>{section.name}</strong> (Thứ tự: {section.order}) – Loại:{' '}
                {section.section_type}
              </li>
            ))
          ) : (
            <p>Không có section nào.</p>
          )}
        </ul>
      )}
    </div>
  );
}
