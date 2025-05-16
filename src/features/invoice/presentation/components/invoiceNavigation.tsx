type Props = {
  hasNext: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
};

export default function InvoiceNavigation({ hasNext, hasPrev, onNext, onPrev }: Props) {
  return (
    <div className="flex justify-between pt-4">
      <button
        disabled={!hasPrev}
        onClick={onPrev}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
      >
        ← Hóa đơn trước
      </button>

      <button
        disabled={!hasNext}
        onClick={onNext}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        Hóa đơn tiếp →
      </button>
    </div>
  );
}
