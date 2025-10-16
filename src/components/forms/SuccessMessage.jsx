/**
 * Komponen SuccessMessage
 * Menampilkan pesan sukses dengan ikon dan styling hijau.
 *
 * Props:
 * - message: string atau object { message } yang berisi pesan sukses.
 * - action: elemen React opsional untuk aksi tambahan (misal tombol).
 */
export default function SuccessMessage({ message, action }) {
  // Mendukung message sebagai string atau object { message }
  const displayMessage =
    typeof message === "string"
      ? message
      : typeof message === "object" && message?.message
      ? message.message
      : "";

  // Jika tidak ada pesan yang ditampilkan, kembalikan null (tidak render apapun)
  if (!displayMessage) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <div className="flex">
        {/* Bagian ikon sukses */}
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-green-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {/* Bagian pesan dan aksi tambahan */}
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800">{displayMessage}</p>
          {/* Render aksi tambahan jika ada */}
          {action && <div className="mt-2">{action}</div>}
        </div>
      </div>
    </div>
  );
}
