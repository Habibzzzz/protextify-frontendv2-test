import { Type, FileText, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { Badge, Card, CardContent } from "../ui";

/**
 * Komponen untuk menampilkan statistik teks, termasuk jumlah kata, karakter,
 * kalimat, paragraf, estimasi waktu baca, progress bar, dan pesan validasi.
 *
 * @param {Object} props
 * @param {Object} props.stats - Statistik teks (words, charactersWithSpaces, sentences, paragraphs, readingTimeMinutes)
 * @param {Object} props.limitChecks - Status limit kata/karakter dan persentase progress
 * @param {Object} props.validation - Status validasi (errors, warnings, isValid)
 * @param {string} [props.className] - Kelas CSS tambahan
 * @param {boolean} [props.showDetailed] - Apakah menampilkan statistik detail
 */
const TextStatistics = ({
  stats,
  limitChecks,
  validation,
  className = "",
  showDetailed = true,
}) => {
  /**
   * Mengembalikan warna teks untuk jumlah kata berdasarkan status limit.
   * @returns {string} Kelas warna Tailwind
   */
  const getWordCountColor = () => {
    if (limitChecks.isWordLimitExceeded) return "text-red-600";
    if (limitChecks.shouldWarnWords) return "text-yellow-600";
    return "text-gray-600";
  };

  /**
   * Mengembalikan warna teks untuk jumlah karakter berdasarkan status limit.
   * @returns {string} Kelas warna Tailwind
   */
  const getCharacterCountColor = () => {
    if (limitChecks.isCharacterLimitExceeded) return "text-red-600";
    if (limitChecks.shouldWarnCharacters) return "text-yellow-600";
    return "text-gray-600";
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* === Statistik Utama: Kata & Karakter === */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Type className="h-4 w-4 text-gray-500" />
              <span className={`text-sm font-medium ${getWordCountColor()}`}>
                {stats.words} / {limitChecks.wordsRemaining + stats.words} kata
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className={`text-sm ${getCharacterCountColor()}`}>
                {stats.charactersWithSpaces} karakter
              </span>
            </div>
          </div>

          {/* === Statistik Detail: Kalimat, Paragraf, Waktu Baca === */}
          {showDetailed && (
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">{stats.sentences}</span>
                <span className="ml-1">kalimat</span>
              </div>
              <div>
                <span className="font-medium">{stats.paragraphs}</span>
                <span className="ml-1">paragraf</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{stats.readingTimeMinutes} menit</span>
              </div>
            </div>
          )}

          {/* === Progress Bar Kata & Karakter === */}
          <div className="space-y-2">
            {/* Progress Kata */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Kata</span>
                <span>{limitChecks.wordPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    limitChecks.isWordLimitExceeded
                      ? "bg-red-500"
                      : limitChecks.shouldWarnWords
                      ? "bg-yellow-500"
                      : "bg-[#23407a]"
                  }`}
                  style={{
                    width: `${Math.min(100, limitChecks.wordPercentage)}%`,
                  }}
                />
              </div>
            </div>

            {/* Progress Karakter */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Karakter</span>
                <span>{limitChecks.characterPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    limitChecks.isCharacterLimitExceeded
                      ? "bg-red-500"
                      : limitChecks.shouldWarnCharacters
                      ? "bg-yellow-500"
                      : "bg-[#23407a]"
                  }`}
                  style={{
                    width: `${Math.min(100, limitChecks.characterPercentage)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* === Pesan Validasi: Error & Warning === */}
          {(validation.errors.length > 0 || validation.warnings.length > 0) && (
            <div className="space-y-2">
              {/* Error */}
              {validation.errors.map((error, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              ))}

              {/* Warning */}
              {validation.warnings.map((warning, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-yellow-600">{warning}</span>
                </div>
              ))}
            </div>
          )}

          {/* === Status Validasi Sukses === */}
          {validation.isValid &&
            validation.warnings.length === 0 &&
            stats.words > 0 && (
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">
                  Dalam batas yang diizinkan
                </span>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TextStatistics;
