// src/components/home/CTASection.jsx

import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Star, Users } from "lucide-react";
import { Button, Container, Card, CardContent } from "../../components";
import LogoUnila from "../../assets/logo-unila.png";

/**
 * Komponen CTASection
 * Menampilkan section Call-To-Action utama pada halaman home,
 * berisi background visual, judul, deskripsi, tombol aksi, indikator kepercayaan,
 * dan bukti sosial (logo institusi).
 */
export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background dengan gradient dan pola grid transparan */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#0f1b3a]"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>

      {/* Elemen dekoratif mengambang (floating) */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl animate-float-delayed"></div>

      <Container className="relative z-10">
        {/* Bagian utama CTA: Judul, deskripsi, dan tombol aksi */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          {/* Label platform terpercaya */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">
                Platform Terpercaya #1
              </span>
            </div>
          </div>

          {/* Judul utama CTA */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Siap Meningkatkan{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Kualitas Akademik?
            </span>
          </h2>

          {/* Deskripsi singkat platform */}
          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            Bergabunglah dengan Protextify dan rasakan perbedaan dalam mengelola
            tugas akademik dan mendeteksi plagiarisme dengan teknologi AI
            terdepan.
          </p>

          {/* Tombol aksi utama (Daftar dan Login) */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link to="/auth/register">
              <Button
                size="xl"
                className="group bg-white text-[#23407a] hover:bg-gray-50 shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105"
              >
                Daftar Gratis Sekarang
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link to="/auth/login">
              <Button
                size="xl"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                Sudah Punya Akun?
              </Button>
            </Link>
          </div>
        </div>

        {/* Grid indikator kepercayaan (statistik pengguna, rating, akurasi AI) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: <Users className="w-8 h-8" />,
              title: "500+",
              subtitle: "Pengguna Aktif",
              description: "Dipercaya institusi pendidikan",
            },
            {
              icon: <Star className="w-8 h-8" />,
              title: "4.9/5",
              subtitle: "Rating Pengguna",
              description: "Kepuasan tinggi dari educator",
            },
            {
              icon: <Sparkles className="w-8 h-8" />,
              title: "99%",
              subtitle: "Akurasi AI",
              description: "Deteksi plagiarisme terpercisa",
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4 text-white">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold mb-2">{stat.title}</div>
                <div className="text-lg font-semibold mb-2 text-white/90">
                  {stat.subtitle}
                </div>
                <p className="text-sm text-white/70">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bukti sosial: info pricing dan logo institusi */}
        <div className="text-center">
          <div className="text-white/60 text-sm mb-4">
            <p>
              Gratis untuk siswa • Pay-per-use untuk pengajar • No hidden fees
            </p>
          </div>

          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-white/40 text-xs">Trusted by:</div>
            {/* Logo Universitas Lampung */}
            <img
              src={LogoUnila}
              alt="Universitas Lampung"
              className="h-7 w-auto object-contain"
              title="Universitas Lampung"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
