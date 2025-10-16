// src/components/forms/FormError.jsx

/**
 * Komponen FormError
 * Menampilkan pesan error pada form.
 *
 * Props:
 * - error: Bisa berupa objek error atau array error (misal dari validasi).
 *   Jika tidak ada error, komponen tidak akan dirender.
 */
export default function FormError({ error }) {
  // Jika tidak ada error, tidak merender apapun
  if (!error) return null;

  /**
   * Menyusun daftar pesan error.
   * Jika error berupa array, ambil semua pesan.
   * Jika error berupa objek, ambil pesan dari properti message.
   */
  const errorMessages = Array.isArray(error)
    ? error.map((e) => e.message || e)
    : [error.message || error];

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex">
        {/* Icon error */}
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {/* Bagian pesan error */}
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Terjadi kesalahan
          </h3>
          <div className="mt-2 text-sm text-red-700 space-y-1">
            {/* Render semua pesan error */}
            {errorMessages.map((msg, idx) => (
              <div key={idx}>
                {msg || "Terjadi kesalahan yang tidak diketahui"}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
