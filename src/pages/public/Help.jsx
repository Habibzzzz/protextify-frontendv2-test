// src/pages/public/Help.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Search,
  HelpCircle,
  MessageCircle,
  Mail,
  Camera as Instagram,
  FileQuestion,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Button, Container, Card, CardContent, Badge } from "../../components";

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const faqs = [
    {
      category: "Umum",
      question: "Apa itu Protextify?",
      answer:
        "Protextify adalah platform deteksi plagiarisme berbasis AI yang dirancang khusus untuk institusi pendidikan. Platform ini membantu pengajar mengelola tugas, mendeteksi plagiarisme, dan memantau progress siswa dengan teknologi terdepan.",
    },
    {
      category: "Umum",
      question: "Siapa saja yang bisa menggunakan Protextify?",
      answer:
        "Protextify dapat digunakan oleh pengajar/dosen untuk mengelola kelas dan tugas, serta mahasiswa untuk mengerjakan dan submit tugas. Platform ini cocok untuk semua jenjang pendidikan dari SMA hingga perguruan tinggi.",
    },
    {
      category: "Akun",
      question: "Bagaimana cara mendaftar akun?",
      answer:
        "Anda bisa mendaftar melalui halaman register dengan mengisi email, password, dan memilih role (Instructor atau Student). Setelah mendaftar, Anda akan menerima email verifikasi untuk mengaktifkan akun.",
    },
    {
      category: "Akun",
      question: "Lupa password, bagaimana cara reset?",
      answer:
        "Klik 'Lupa Password' di halaman login, masukkan email Anda, dan kami akan mengirimkan link reset password ke email tersebut. Link valid selama 1 jam.",
    },
    {
      category: "Kelas",
      question: "Bagaimana cara membuat kelas baru?",
      answer:
        "Sebagai instructor, masuk ke dashboard dan klik 'Buat Kelas Baru'. Isi informasi kelas seperti nama, deskripsi, dan kode kelas. Setelah dibuat, Anda bisa membagikan kode kelas kepada siswa.",
    },
    {
      category: "Kelas",
      question: "Bagaimana siswa bergabung ke kelas?",
      answer:
        "Siswa dapat bergabung dengan memasukkan kode kelas yang diberikan oleh instructor. Masuk ke dashboard, klik 'Gabung Kelas', dan masukkan kode 6 digit yang diberikan.",
    },
    {
      category: "Tugas",
      question: "Bagaimana cara membuat tugas?",
      answer:
        "Masuk ke kelas yang ingin Anda buatkan tugas, klik 'Buat Tugas Baru'. Isi detail tugas seperti judul, deskripsi, deadline, dan pengaturan lainnya. Setelah pembayaran dikonfirmasi, tugas akan aktif.",
    },
    {
      category: "Tugas",
      question: "Apakah bisa mengedit tugas yang sudah dibuat?",
      answer:
        "Ya, Anda bisa mengedit detail tugas seperti judul, deskripsi, dan deadline. Namun, jika sudah ada siswa yang submit, perubahan tertentu mungkin dibatasi untuk menjaga fairness.",
    },
    {
      category: "Plagiarisme",
      question: "Bagaimana cara kerja deteksi plagiarisme?",
      answer:
        "Sistem kami menggunakan AI dari Winston AI untuk mendeteksi plagiarisme. Teks akan dibandingkan dengan database internet dan dokumen lainnya. Hasil berupa persentase kemiripan dan highlight pada bagian yang terdeteksi.",
    },
    {
      category: "Plagiarisme",
      question: "Berapa lama proses deteksi plagiarisme?",
      answer:
        "Proses deteksi plagiarisme biasanya memakan waktu 30-60 detik tergantung panjang dokumen. Anda akan menerima notifikasi saat hasil sudah siap.",
    },
    {
      category: "Pembayaran",
      question: "Berapa biaya menggunakan Protextify?",
      answer:
        "Biaya adalah Rp 2.700 per tugas per siswa, dibayar oleh instructor saat membuat tugas. Tidak ada biaya bulanan atau tahunan. Misalnya, 1 tugas untuk 30 siswa = Rp 81.000.",
    },
    {
      category: "Pembayaran",
      question: "Metode pembayaran apa saja yang tersedia?",
      answer:
        "Kami menerima pembayaran melalui transfer bank, e-wallet (OVO, GoPay, Dana), dan kartu kredit. Setelah pembayaran dikonfirmasi, tugas akan langsung aktif.",
    },
    {
      category: "Teknis",
      question: "Browser apa yang didukung?",
      answer:
        "Protextify mendukung semua browser modern seperti Chrome, Firefox, Safari, dan Edge versi terbaru. Kami merekomendasikan Chrome untuk pengalaman terbaik.",
    },
    {
      category: "Teknis",
      question: "Apakah bisa diakses dari HP?",
      answer:
        "Ya! Protextify fully responsive dan dapat diakses dari smartphone, tablet, atau komputer dengan pengalaman yang optimal di semua device.",
    },
  ];

  const contactOptions = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      description: "Kirim email dan kami akan balas dalam 24 jam",
      action: "protextify2025@gmail.com",
      link: "mailto:protextify2025@gmail.com",
      color: "blue",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "WhatsApp Chat",
      description: "Chat langsung via WhatsApp dengan tim support",
      action: "Chat WhatsApp",
      link: "https://wa.me/6282363343710?text=Halo,%20saya%20butuh%20bantuan%20tentang%20Protextify",
      color: "green",
    },
    {
      icon: <Instagram className="w-6 h-6" />,
      title: "Instagram",
      description: "Chat langsung via Instagram dengan tim support",
      action: "Chat Instagram",
      link: "https://www.instagram.com/protextify/",
      color: "purple",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

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
                <HelpCircle className="w-4 h-4 mr-2" />
                Pusat Bantuan
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Ada yang Bisa{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Kami Bantu?
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Temukan jawaban untuk pertanyaan Anda atau hubungi tim support
              kami yang siap membantu 24/7
            </p>

            {/* Search Bar */}
            {/* <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari pertanyaan atau topik bantuan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-500"
                />
              </div>
              {searchQuery && (
                <p className="mt-4 text-white/70 text-sm">
                  Ditemukan {filteredFaqs.length} hasil untuk "{searchQuery}"
                </p>
              )}
            </div> */}
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-6">
                <FileQuestion className="w-4 h-4 mr-2" />
                Pertanyaan Umum
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">
                Temukan jawaban untuk pertanyaan yang paling sering ditanyakan
              </p>
            </div>

            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2 text-xs">
                          {faq.category}
                        </Badge>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {faq.question}
                        </h3>
                      </div>
                      {openFaqIndex === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                      )}
                    </button>
                    {openFaqIndex === index && (
                      <div className="px-6 pb-6">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <FileQuestion className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Tidak ditemukan hasil untuk "{searchQuery}"
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Coba kata kunci lain atau hubungi support kami
                </p>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Masih Butuh Bantuan?
              </h2>
              <p className="text-gray-600">
                Tim support kami siap membantu Anda dengan cara yang paling
                nyaman
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactOptions.map((option, index) => (
                <a
                  key={index}
                  href={option.link}
                  target={option.title === "WhatsApp Chat" ? "_blank" : "_self"}
                  rel={
                    option.title === "WhatsApp Chat"
                      ? "noopener noreferrer"
                      : ""
                  }
                  className="block"
                >
                  <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                    <CardContent className="p-8 text-center">
                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
                          option.color === "blue"
                            ? "bg-blue-100 text-blue-600"
                            : option.color === "green"
                            ? "bg-green-100 text-green-600"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        {option.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {option.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-6">
                        {option.description}
                      </p>
                      <Button variant="outline" className="w-full">
                        {option.action}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </a>
              ))}
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
              Protextify
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
