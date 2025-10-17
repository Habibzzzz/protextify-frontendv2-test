// src/pages/public/Pricing.jsx
import { Link } from "react-router-dom";
import {
  Check,
  ArrowRight,
  Shield,
  Users,
  FileText,
  Calculator,
  Sparkles,
  Info,
  Star,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Button, Container, Card, CardContent, Badge } from "../../components";

export default function Pricing() {
  const features = [
    {
      text: "Deteksi plagiarisme dengan teknologi AI",
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      text: "Real-time collaboration editor",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      text: "Analytics & reporting lengkap",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    { text: "Export PDF & DOCX", icon: <FileText className="w-5 h-5" /> },
    { text: "Manajemen kelas unlimited", icon: <Users className="w-5 h-5" /> },
    { text: "Support prioritas 24/7", icon: <Shield className="w-5 h-5" /> },
  ];

  const faqs = [
    {
      question: "Bagaimana cara menghitung biayanya?",
      answer:
        "Biaya dihitung berdasarkan jumlah tugas yang Anda buat dan jumlah siswa yang mengerjakan tugas tersebut. Setiap tugas per siswa dikenakan biaya Rp 2.700. Misalnya, jika Anda membuat 1 tugas untuk 30 siswa, total biaya adalah Rp 81.000.",
    },
    {
      question: "Kapan saya harus membayar?",
      answer:
        "Pembayaran dilakukan di awal saat Anda membuat tugas. Sistem akan menghitung otomatis berdasarkan jumlah siswa di kelas tersebut. Anda akan mendapatkan invoice yang dapat dibayar melalui berbagai metode pembayaran.",
    },
    {
      question: "Bagaimana sistem pembayarannya?",
      answer:
        "Kami menerima pembayaran melalui transfer bank, e-wallet (OVO, GoPay, Dana), dan kartu kredit. Setelah pembayaran dikonfirmasi, tugas akan langsung aktif dan siswa dapat mulai mengerjakan.",
    },
    {
      question: "Apakah ada biaya tambahan lainnya?",
      answer:
        "Tidak ada biaya tambahan! Harga Rp 2.700 per tugas per siswa sudah termasuk semua fitur: deteksi plagiarisme AI, real-time collaboration, analytics, export, dan support. Tidak ada biaya tersembunyi.",
    },
    {
      question: "Bagaimana jika jumlah siswa berubah?",
      answer:
        "Biaya dihitung berdasarkan jumlah siswa yang terdaftar di kelas saat tugas dibuat. Jika ada siswa yang keluar setelah tugas dibuat, biaya tidak berubah. Namun jika ada siswa baru yang masuk, Anda perlu membayar tambahan untuk siswa tersebut.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#0f1b3a]">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
        </div>

        <Container className="relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="mb-8 flex justify-center">
              <Badge
                variant="glass"
                className="px-4 py-2 text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white"
              >
                <Star className="w-4 h-4 mr-2" />
                Harga Transparan
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Harga{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Transparan & Sederhana
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Bayar sesuai penggunaan. Tidak ada biaya bulanan atau tahunan.
              Hanya bayar untuk tugas yang Anda buat.
            </p>

            {/* Price Highlight */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-white/20">
              <div className="text-center">
                <p className="text-white/80 text-sm mb-2">
                  Biaya per tugas per siswa
                </p>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-5xl font-bold text-white">
                    Rp 2.700
                  </span>
                </div>
                <p className="text-white/60 text-sm">
                  Sudah termasuk semua fitur premium
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features & Pricing Section */}
      <section className="py-24 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Main Pricing Card */}
            <Card className="border-0 shadow-2xl overflow-hidden mb-16">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#23407a]/5 to-purple-500/5"></div>

              <CardContent className="p-12 relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-[#23407a]/10 rounded-2xl mb-6">
                    <Calculator className="w-10 h-10 text-[#23407a]" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Cara Kerja Pembayaran
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Sistem pembayaran yang sederhana dan transparan untuk
                    pengajar
                  </p>
                </div>

                {/* Price Box */}
                <div className="bg-gradient-to-r from-[#23407a] to-purple-600 rounded-2xl p-8 text-center mb-8">
                  <p className="text-white/80 text-sm mb-2">
                    Biaya per tugas per siswa
                  </p>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-6xl font-bold text-white">
                      Rp 2.700
                    </span>
                  </div>
                  <p className="text-white/80 text-sm mb-6">
                    Hanya dibayar oleh instructor saat membuat tugas
                  </p>

                  {/* Example */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mt-6">
                    <p className="text-white/90 font-semibold mb-3">
                      Contoh Perhitungan:
                    </p>
                    <div className="space-y-2 text-white/80 text-sm">
                      <p>1 tugas × 30 siswa = Rp 81.000</p>
                      <p>2 tugas × 40 siswa = Rp 216.000</p>
                      <p>5 tugas × 50 siswa = Rp 675.000</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="text-center mb-8">
                  <Link to="/auth/register">
                    <Button
                      className="bg-[#23407a] hover:bg-[#1a2f5c] text-lg px-8"
                      size="lg"
                    >
                      Mulai Sekarang
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  {features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 bg-white rounded-lg"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                        {feature.icon}
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">
                          {feature.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-md text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Check className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Tidak Ada Biaya Bulanan
                  </h3>
                  <p className="text-sm text-gray-600">
                    Bayar hanya saat membuat tugas. Tidak ada subscription fee.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Semua Fitur Included
                  </h3>
                  <p className="text-sm text-gray-600">
                    Akses penuh ke semua fitur premium tanpa batasan.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Unlimited Kelas
                  </h3>
                  <p className="text-sm text-gray-600">
                    Buat kelas sebanyak yang Anda mau tanpa batasan.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-6">
                <Info className="w-4 h-4 mr-2" />
                Pertanyaan Umum
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Ada Pertanyaan?
              </h2>
              <p className="text-xl text-gray-600">
                Temukan jawaban untuk pertanyaan yang sering ditanyakan
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">
                Masih ada pertanyaan? Kami siap membantu!
              </p>
              <Button variant="outline" size="lg">
                Hubungi Support
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#0f1b3a]"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>

        <Container className="relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Siap Memulai?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Bergabunglah dengan ribuan institusi yang telah mempercayai
              Protextify untuk menjaga integritas akademik
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/register">
                <Button
                  size="xl"
                  className="bg-white text-[#23407a] hover:bg-gray-50"
                >
                  Mulai Sekarang
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  size="xl"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10"
                >
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
