import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";
import { format, parseISO, isValid, addHours, endOfDay } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Komponen DateTimePicker
 * Komponen input tanggal dan waktu dengan validasi, preset, dan tampilan informasi.
 * Props:
 * - label: Label input
 * - value: Nilai tanggal dan waktu (ISO string atau Date)
 * - onChange: Fungsi callback saat nilai berubah
 * - error: Pesan error eksternal
 * - minDate: Tanggal minimal yang bisa dipilih
 * - maxDate: Tanggal maksimal yang bisa dipilih
 * - placeholder: Placeholder input
 * - disabled: Status disabled input
 * - required: Apakah input wajib diisi
 * - timezone: Nama timezone (informasi saja)
 * - showSeconds: Tampilkan detik pada input
 * - showTimezone: Tampilkan info timezone
 * - presets: Array preset custom
 */
export default function DateTimePicker({
  label,
  value,
  onChange,
  error,
  minDate = new Date(),
  maxDate,
  placeholder = "Pilih tanggal dan waktu...",
  disabled = false,
  required = false,
  timezone = "Asia/Jakarta",
  showSeconds = false,
  showTimezone = false,
  presets = [],
}) {
  // State internal untuk input dan validasi
  const [internalValue, setInternalValue] = useState("");
  const [isValidInput, setIsValidInput] = useState(true);
  const [validationMessage, setValidationMessage] = useState("");

  /**
   * Efek: Konversi value eksternal ke format input[type=datetime-local]
   * Berjalan saat value atau showSeconds berubah.
   */
  useEffect(() => {
    if (value) {
      try {
        const date =
          typeof value === "string" ? parseISO(value) : new Date(value);
        if (isValid(date)) {
          setInternalValue(
            format(
              date,
              showSeconds ? "yyyy-MM-dd'T'HH:mm:ss" : "yyyy-MM-dd'T'HH:mm"
            )
          );
          setIsValidInput(true);
          setValidationMessage("");
        } else {
          setInternalValue("");
          setIsValidInput(false);
          setValidationMessage("Format tanggal tidak valid");
        }
      } catch {
        setInternalValue("");
        setIsValidInput(false);
        setValidationMessage("Format tanggal tidak valid");
      }
    } else {
      setInternalValue("");
      setIsValidInput(true);
      setValidationMessage("");
    }
  }, [value, showSeconds]);

  /**
   * Fungsi validasi tanggal dan waktu sesuai kebutuhan backend.
   * @param {string} dateTimeValue - Nilai input tanggal dan waktu
   * @returns {boolean} - Status validasi
   */
  const validateDateTime = (dateTimeValue) => {
    if (!dateTimeValue) {
      if (required) {
        setValidationMessage("Tanggal dan waktu wajib diisi");
        setIsValidInput(false);
        return false;
      }
      setIsValidInput(true);
      setValidationMessage("");
      return true;
    }

    try {
      const selectedDate = new Date(dateTimeValue);

      if (!isValid(selectedDate)) {
        setValidationMessage("Format tanggal tidak valid");
        setIsValidInput(false);
        return false;
      }

      if (minDate && selectedDate < new Date(minDate)) {
        setValidationMessage(
          `Tanggal tidak boleh sebelum ${format(
            new Date(minDate),
            "dd MMMM yyyy HH:mm",
            { locale: id }
          )}`
        );
        setIsValidInput(false);
        return false;
      }

      if (maxDate && selectedDate > new Date(maxDate)) {
        setValidationMessage(
          `Tanggal tidak boleh setelah ${format(
            new Date(maxDate),
            "dd MMMM yyyy HH:mm",
            { locale: id }
          )}`
        );
        setIsValidInput(false);
        return false;
      }

      setIsValidInput(true);
      setValidationMessage("");
      return true;
    } catch {
      setValidationMessage("Format tanggal tidak valid");
      setIsValidInput(false);
      return false;
    }
  };

  /**
   * Handler perubahan input tanggal dan waktu.
   * Mengupdate state dan memanggil onChange jika valid.
   * @param {object} e - Event perubahan input
   */
  const handleDateTimeChange = (e) => {
    const dateTimeValue = e.target.value;
    setInternalValue(dateTimeValue);

    if (validateDateTime(dateTimeValue)) {
      if (dateTimeValue) {
        // Konversi ke ISO string untuk backend
        const selectedDate = new Date(dateTimeValue);
        onChange?.(selectedDate.toISOString());
      } else {
        onChange?.(null);
      }
    }
  };

  /**
   * Format nilai tanggal untuk tampilan informasi.
   * @param {string|Date} value - Nilai tanggal
   * @returns {string} - Teks tanggal terformat
   */
  const formatDisplayValue = (value) => {
    if (!value) return "";
    try {
      const date =
        typeof value === "string" ? parseISO(value) : new Date(value);
      if (!isValid(date)) return "";
      return format(date, "EEEE, dd MMMM yyyy 'pukul' HH:mm", { locale: id });
    } catch {
      return "";
    }
  };

  /**
   * Mendapatkan offset timezone lokal (informasi saja).
   * @returns {string} - Offset GMT
   */
  const getTimezoneOffset = () => {
    const offset = new Date().getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset <= 0 ? "+" : "-";
    return `GMT${sign}${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  /**
   * Handler klik preset tanggal.
   * Mengupdate nilai input dan memanggil onChange.
   * @param {object} preset - Objek preset
   */
  const handlePresetClick = (preset) => {
    const date = preset.getValue();
    const formatted = format(
      date,
      showSeconds ? "yyyy-MM-dd'T'HH:mm:ss" : "yyyy-MM-dd'T'HH:mm"
    );
    setInternalValue(formatted);
    onChange?.(date.toISOString());
  };

  /**
   * Preset default untuk pemilihan cepat tanggal dan waktu.
   */
  const defaultPresets = [
    {
      label: "1 jam dari sekarang",
      getValue: () => addHours(new Date(), 1),
    },
    {
      label: "1 hari dari sekarang",
      getValue: () => addHours(new Date(), 24),
    },
    {
      label: "1 minggu dari sekarang",
      getValue: () => addHours(new Date(), 168),
    },
    {
      label: "Akhir hari ini",
      getValue: () => endOfDay(new Date()),
    },
  ];

  // Gabungan preset custom dan default
  const allPresets = presets.length > 0 ? presets : defaultPresets;

  /**
   * Format tanggal min/max untuk atribut input.
   * @param {string|Date} date - Tanggal min/max
   * @returns {string|undefined} - Format input
   */
  const formatMinMax = (date) => {
    if (!date) return undefined;
    try {
      const d = typeof date === "string" ? parseISO(date) : new Date(date);
      return format(
        d,
        showSeconds ? "yyyy-MM-dd'T'HH:mm:ss" : "yyyy-MM-dd'T'HH:mm"
      );
    } catch {
      return undefined;
    }
  };

  // Render komponen
  return (
    <div className="space-y-2">
      {/* Label input */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input utama tanggal dan waktu */}
      <div className="relative">
        <input
          type="datetime-local"
          value={internalValue}
          onChange={handleDateTimeChange}
          min={formatMinMax(minDate)}
          max={formatMinMax(maxDate)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23407a] focus:border-transparent
            transition-all duration-200
            ${
              error || !isValidInput
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300"
            }
            ${
              disabled
                ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                : "bg-white"
            }
          `}
          placeholder={placeholder}
          step={showSeconds ? 1 : 60}
        />

        {/* Ikon kalender di input */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Tombol preset tanggal dan waktu */}
      {!disabled && allPresets.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 self-center">
            Quick select:
          </span>
          {allPresets.map((preset, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handlePresetClick(preset)}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors duration-200"
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {/* Tampilan nilai terformat dan info timezone */}
      {value && isValidInput && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900">
                {formatDisplayValue(value)}
              </p>
              {showTimezone && (
                <p className="text-xs text-blue-700">
                  Timezone: {timezone} ({getTimezoneOffset()})
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pesan error validasi */}
      {(error || !isValidInput) && (
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{error || validationMessage}</span>
        </div>
      )}

      {/* Bantuan format dan info min/max */}
      {!error && !validationMessage && (
        <div className="text-xs text-gray-500 space-y-1">
          <p>Format: DD/MM/YYYY HH:MM</p>
          {minDate && (
            <p>Minimal: {format(new Date(minDate), "dd/MM/yyyy HH:mm")}</p>
          )}
          {maxDate && (
            <p>Maksimal: {format(new Date(maxDate), "dd/MM/yyyy HH:mm")}</p>
          )}
        </div>
      )}
    </div>
  );
}
