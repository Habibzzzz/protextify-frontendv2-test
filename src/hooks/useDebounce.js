import { useState, useEffect } from "react";

/**
 * Custom hook untuk menunda pembaruan nilai (debounce).
 * @param {*} value - Nilai yang akan di-debounce.
 * @param {number} delay - Waktu tunda dalam milidetik.
 * @returns {*} Nilai yang sudah di-debounce.
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set timeout untuk memperbarui nilai setelah delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Bersihkan timeout jika nilai berubah (misalnya saat user terus mengetik)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Hanya jalankan ulang efek jika value atau delay berubah

  return debouncedValue;
};

export default useDebounce;
