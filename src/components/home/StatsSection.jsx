// src/components/home/StatsSection.jsx

import { Container, AnimatedCounter } from "../../components";
import { Users, BookOpen, FileText, Award } from "lucide-react";

/**
 * Komponen StatsSection
 * Menampilkan statistik utama aplikasi dalam bentuk grid dengan ikon, angka animasi, dan label.
 * Statistik yang ditampilkan: Pengguna Aktif, Kelas Dibuat, Tugas Dianalisis, Akurasi Deteksi.
 */
export default function StatsSection() {
  // Array berisi data statistik yang akan ditampilkan pada halaman utama
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: 500,
      label: "Pengguna Aktif",
      suffix: "+",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      value: 50,
      label: "Kelas Dibuat",
      suffix: "+",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      value: 1000,
      label: "Tugas Dianalisis",
      suffix: "+",
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: 99,
      label: "Akurasi Deteksi",
      suffix: "%",
    },
  ];

  return (
    // Section utama dengan background gradasi dan padding
    <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50/30">
      <Container>
        {/* Grid untuk menampilkan setiap statistik */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            // Card statistik individual
            <div key={index} className="text-center group">
              {/* Ikon statistik dengan efek hover */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#23407a]/10 rounded-2xl text-[#23407a] mb-4 group-hover:bg-[#23407a] group-hover:text-white transition-all duration-300">
                {stat.icon}
              </div>
              {/* AnimatedCounter untuk menampilkan angka statistik secara animasi */}
              <div className="text-4xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              {/* Label statistik */}
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
