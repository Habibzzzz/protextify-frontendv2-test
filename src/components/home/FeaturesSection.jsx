// src/components/home/FeaturesSection.jsx

import {
  Container,
  Card,
  CardContent,
  CardTitle,
  Grid,
  Badge,
} from "../../components";
import {
  Shield,
  Zap,
  Users,
  BarChart3,
  Clock,
  FileText,
  Brain,
  Settings,
  CheckCircle,
} from "lucide-react";

/**
 * Komponen utama untuk menampilkan bagian fitur unggulan pada halaman utama.
 * Menampilkan daftar fitur produk dan benefit tambahan secara responsif.
 */
export default function FeaturesSection() {
  // Daftar fitur utama yang ditampilkan pada section fitur
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Deteksi Plagiarisme Canggih",
      description:
        "Teknologi AI terdepan untuk mendeteksi plagiarisme dengan akurasi tinggi dan analisis mendalam",
      category: "AI Powered",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Manajemen Kelas Mudah",
      description:
        "Kelola kelas, tugas, dan siswa dengan antarmuka yang intuitif dan user-friendly",
      category: "Management",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Collaboration",
      description:
        "Editor real-time dengan auto-save dan monitoring aktivitas untuk pengalaman menulis optimal",
      category: "Collaboration",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics & Reporting",
      description:
        "Dashboard analytics komprehensif untuk memantau progress dan performa siswa",
      category: "Analytics",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Keamanan Data Terjamin",
      description:
        "Enkripsi end-to-end dan keamanan tingkat enterprise untuk melindungi data akademik",
      category: "Security",
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Integrasi Mudah",
      description:
        "API yang lengkap dan dokumentasi jelas untuk integrasi dengan sistem LMS yang ada",
      category: "Integration",
    },
  ];

  return (
    // Section utama fitur unggulan
    <section className="py-24 bg-white">
      <Container>
        {/* Header section fitur unggulan */}
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-6">
            ✨ Fitur Unggulan
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Solusi Lengkap untuk{" "}
            <span className="text-[#23407a]">Deteksi Plagiarisme</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Platform yang dirancang khusus untuk kebutuhan akademik modern
            dengan teknologi AI yang canggih dan antarmuka yang mudah digunakan.
          </p>
        </div>

        {/* Grid daftar fitur utama */}
        <Grid cols={1} mdCols={2} lgCols={3} gap={8} className="mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Overlay gradasi saat hover pada card fitur */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#23407a]/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <CardContent className="p-8 relative z-10">
                {/* Badge kategori fitur */}
                <div className="mb-4">
                  <Badge
                    variant="outline"
                    className="text-xs text-[#23407a] border-[#23407a]/20 bg-[#23407a]/5"
                  >
                    {feature.category}
                  </Badge>
                </div>

                {/* Icon fitur */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-[#23407a]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#23407a] group-hover:text-white transition-all duration-300 group-hover:scale-110 text-[#23407a]">
                    {feature.icon}
                  </div>
                </div>

                {/* Judul dan deskripsi fitur */}
                <CardTitle className="mb-4 text-center group-hover:text-[#23407a] transition-colors">
                  {feature.title}
                </CardTitle>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>

                {/* Tombol pelajari lebih lanjut, muncul saat hover */}
                <div className="mt-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="text-[#23407a] font-medium text-sm hover:underline">
                    Pelajari Lebih Lanjut →
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </Grid>

        {/* Section benefit tambahan Protextify */}
        <div className="bg-gradient-to-r from-[#23407a]/5 to-purple-500/5 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Protextify?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Lebih dari sekadar deteksi plagiarisme, Protextify memberikan
              ekosistem lengkap untuk pembelajaran berkualitas
            </p>
          </div>

          {/* Grid daftar benefit tambahan */}
          <Grid cols={1} mdCols={2} lgCols={3} gap={6}>
            {[
              {
                icon: <CheckCircle className="w-6 h-6" />,
                text: "99% Akurasi Deteksi",
              },
              {
                icon: <Clock className="w-6 h-6" />,
                text: "Proses Cepat < 30 Detik",
              },
              {
                icon: <FileText className="w-6 h-6" />,
                text: "Format File Lengkap",
              },
              // {
              //   icon: <Shield className="w-6 h-6" />,
              //   text: "ISO 27001 Certified",
              // },
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-lg p-4"
              >
                <div className="text-[#23407a]">{benefit.icon}</div>
                <span className="font-medium text-gray-900">
                  {benefit.text}
                </span>
              </div>
            ))}
          </Grid>
        </div>
      </Container>
    </section>
  );
}
