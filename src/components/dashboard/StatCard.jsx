// src/components/dashboard/StatCard.jsx

import { Card, CardContent } from "../ui";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

/**
 * StatCard Component
 *
 * Komponen kartu statistik yang menampilkan judul, nilai, ikon, dan tren perubahan.
 * Hanya menerima field yang tersedia dari Backend/hook.
 *
 * Props:
 * - title: string - Judul statistik.
 * - value: string|number - Nilai statistik.
 * - icon: React.Component - Komponen ikon yang akan ditampilkan.
 * - color: string - Warna utama kartu (default: "blue").
 * - gradient: string - Gradient background (opsional, tidak digunakan).
 * - trend: object - Data tren { change, isPositive }.
 * - onClick: function|null - Fungsi yang dipanggil saat kartu diklik (opsional).
 */
const StatCard = ({
  title,
  value,
  icon: _Icon, // lint: unused arg
  color = "blue",
  gradient: _gradient, // lint: unused arg
  trend, // { change, isPositive }
  onClick = null,
}) => {
  // Mapping warna untuk background dan border kartu
  const colorClasses = {
    blue: "from-blue-100 to-blue-50 border-blue-200",
    green: "from-green-100 to-green-50 border-green-200",
    yellow: "from-yellow-100 to-yellow-50 border-yellow-200",
    purple: "from-purple-100 to-purple-50 border-purple-200",
    red: "from-red-100 to-red-50 border-red-200",
  };

  // Mapping warna untuk ikon
  const iconColors = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    purple: "text-purple-600",
    red: "text-red-600",
  };

  return (
    <Card
      className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${
        colorClasses[color]
      } ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {/* 
        Decorative background pattern (nonaktif, bisa diaktifkan jika diperlukan)
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8">
            <div
              className={`w-full h-full rounded-full bg-gradient-to-br ${gradient} opacity-20`}
            ></div>
          </div>
        </div>
      */}

      <CardContent className="p-6 relative z-10">
        {/* Bagian utama kartu: ikon, judul, dan nilai */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-inner`}
            >
              {/* Ikon statistik */}
              {_Icon && <_Icon className={`h-6 w-6 ${iconColors[color]}`} />}
            </div>
            <div>
              {/* Judul statistik */}
              <p className="text-sm font-medium text-gray-600">{title}</p>
              {/* Nilai statistik */}
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        </div>

        {/* Bagian tren perubahan (jika tersedia) */}
        {trend && (
          <div className="mt-3 flex items-center text-xs">
            {trend.isPositive ? (
              // Ikon tren naik
              <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
            ) : (
              // Ikon tren turun
              <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
            )}
            <span
              className={trend.isPositive ? "text-green-700" : "text-red-700"}
            >
              {/* Persentase perubahan dibanding periode sebelumnya */}
              {trend.change}% vs periode sebelumnya
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
