// src/pages/public/Docs.jsx
import { Link } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  ClipboardCheck,
  SearchCheck,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { Button, Container, Card, CardContent, Badge } from "../../components";

const sections = [
  {
    icon: <GraduationCap className="h-6 w-6" />,
    title: "Untuk Mahasiswa",
    description:
      "Panduan bergabung ke kelas, membuka tugas, menulis jawaban, dan melihat hasil evaluasi.",
  },
  {
    icon: <ClipboardCheck className="h-6 w-6" />,
    title: "Untuk Instructor",
    description:
      "Langkah membuat kelas, membuat tugas, memantau submission, dan memberi penilaian.",
  },
  {
    icon: <SearchCheck className="h-6 w-6" />,
    title: "Plagiarisme",
    description:
      "Cara membaca laporan plagiarisme, skor kemiripan, dan sumber yang terdeteksi.",
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: "Pembayaran",
    description:
      "Ringkasan alur transaksi tugas, riwayat pembayaran, dan status pembayaran.",
  },
];

export default function Docs() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#0f1b3a]">
        <Container className="relative z-10 py-24">
          <div className="max-w-4xl text-white">
            <Badge
              variant="glass"
              className="mb-6 bg-white/10 text-white border border-white/20"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Dokumentasi
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Dokumentasi Protextify
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl">
              Panduan penggunaan fitur utama Protextify untuk mahasiswa,
              instructor, dan admin dalam satu tempat.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/help">
                <Button size="lg" className="bg-white text-[#23407a] hover:bg-gray-50">
                  Buka Pusat Bantuan
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10"
                >
                  Masuk ke Aplikasi
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <Card key={section.title} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-[#23407a]/10 text-[#23407a] flex items-center justify-center mb-5">
                  {section.icon}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {section.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {section.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
