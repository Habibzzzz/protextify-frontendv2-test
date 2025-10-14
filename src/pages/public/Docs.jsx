// src/pages/public/Docs.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Camera,
  Search,
  Calendar,
  MapPin,
  Users,
  Image as ImageIcon,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
} from "lucide-react";
import {
  Button,
  Container,
  Card,
  CardContent,
  Badge,
} from "../../components";

// Import images
import dok1 from "../../assets/dokumentasi/1.jpg";
import dok2 from "../../assets/dokumentasi/2.jpg";
import dok3 from "../../assets/dokumentasi/3.jpg";
import dok4 from "../../assets/dokumentasi/4.jpg";
import dok5 from "../../assets/dokumentasi/5.jpg";

export default function Docs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "Semua Kegiatan", icon: <Camera className="w-4 h-4" /> },
    { id: "workshop", name: "Workshop", icon: <BookOpen className="w-4 h-4" /> },
    { id: "seminar", name: "Seminar", icon: <Users className="w-4 h-4" /> },
    { id: "training", name: "Pelatihan", icon: <Award className="w-4 h-4" /> },
    { id: "event", name: "Event", icon: <Briefcase className="w-4 h-4" /> },
  ];

  const documentations = [
    {
      id: 1,
      title: "Workshop Protextify untuk Dosen",
      description: "Workshop pengenalan platform Protextify dan cara menggunakannya untuk mengelola tugas mahasiswa dengan deteksi plagiarisme AI.",
      category: "workshop",
      image: dok1,
      date: "15 Januari 2025",
      location: "Universitas Lampung, Bandar Lampung",
      participants: "50+ Dosen",
      tags: ["Workshop", "Dosen", "Universitas Lampung"],
    },
    {
      id: 2,
      title: "Seminar Nasional Anti-Plagiarisme",
      description: "Seminar nasional tentang pentingnya integritas akademik dan peran teknologi AI dalam mendeteksi plagiarisme di dunia pendidikan.",
      category: "seminar",
      image: dok2,
      date: "10 Februari 2025",
      location: "Institut Teknologi Bandung",
      participants: "200+ Peserta",
      tags: ["Seminar", "Nasional", "ITB"],
    },
    {
      id: 3,
      title: "Pelatihan Platform Protextify",
      description: "Pelatihan intensif untuk admin dan pengajar dalam mengoptimalkan penggunaan Protextify untuk manajemen tugas dan deteksi plagiarisme.",
      category: "training",
      image: dok3,
      date: "5 Maret 2025",
      location: "Universitas Lampung, Bandar Lampung",
      participants: "75+ Pengajar",
      tags: ["Pelatihan", "UGM", "Admin"],
    },
    {
      id: 4,
      title: "Launching Protextify V2.0",
      description: "Acara peluncuran Protextify versi 2.0 dengan fitur-fitur baru seperti real-time collaboration dan analytics dashboard yang lebih canggih.",
      category: "event",
      image: dok4,
      date: "20 April 2025",
      location: "Universitas Lampung, Bandar Lampung",
      participants: "150+ Institusi",
      tags: ["Launching", "V2.0", "Bandar Lampung"],
    },
    {
      id: 5,
      title: "Sosialisasi Integritas Akademik",
      description: "Kegiatan sosialisasi kepada mahasiswa tentang pentingnya integritas akademik dan cara menghindari plagiarisme dalam penulisan karya ilmiah.",
      category: "event",
      image: dok5,
      date: "10 Mei 2025",
      location: "Universitas Lampung, Bandar Lampung",
      participants: "300+ Mahasiswa",
      tags: ["Sosialisasi", "Mahasiswa", "Unair"],
    },
  ];

  const filteredDocs = documentations.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#0f1b3a]">
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
                <Camera className="w-4 h-4 mr-2" />
                Dokumentasi Kegiatan
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Galeri{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Kegiatan Kami
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Dokumentasi lengkap kegiatan workshop, seminar, pelatihan, dan event
              yang telah kami selenggarakan
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari kegiatan, lokasi, atau universitas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-500"
                />
              </div>
              {searchQuery && (
                <p className="mt-4 text-white/70 text-sm">
                  Ditemukan {filteredDocs.length} kegiatan untuk "{searchQuery}"
                </p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50 border-b sticky top-0 z-10 shadow-sm">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-[#23407a] text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.icon}
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Documentation Grid */}
      <section className="py-24 bg-gray-50">
        <Container>
          {filteredDocs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {filteredDocs.map((doc) => (
                <Card
                  key={doc.id}
                  className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-gray-200">
                    <img
                      src={doc.image}
                      alt={doc.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Tags on Image */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {doc.tags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          className="bg-white/90 backdrop-blur-sm text-gray-900"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#23407a] transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {doc.description}
                    </p>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 gap-3 mb-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-[#23407a]" />
                        <span className="text-sm">{doc.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-[#23407a]" />
                        <span className="text-sm">{doc.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4 text-[#23407a]" />
                        <span className="text-sm">{doc.participants}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      className="bg-[#23407a] hover:bg-[#1a2f5c] w-full"
                      size="sm"
                    >
                      Lihat Detail Kegiatan
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Tidak ditemukan dokumentasi untuk "{searchQuery}"
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Coba kata kunci lain atau pilih kategori berbeda
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Dampak Kegiatan Kami
              </h2>
              <p className="text-gray-600">
                Statistik dan pencapaian dari berbagai kegiatan yang telah kami selenggarakan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-md text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-[#23407a] mb-2">50+</div>
                  <p className="text-gray-600 text-sm">Workshop & Pelatihan</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-purple-600 mb-2">100+</div>
                  <p className="text-gray-600 text-sm">Institusi Partner</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-green-600 mb-2">5000+</div>
                  <p className="text-gray-600 text-sm">Peserta Terlatih</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">25+</div>
                  <p className="text-gray-600 text-sm">Kota di Indonesia</p>
                </CardContent>
              </Card>
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
              Ingin Mengadakan Workshop?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Kami siap membantu institusi Anda mengadakan workshop, seminar,
              atau pelatihan tentang Protextify dan integritas akademik
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/help">
                <Button
                  size="xl"
                  className="bg-white text-[#23407a] hover:bg-gray-50"
                >
                  Hubungi Kami
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  size="xl"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10"
                >
                  Tentang Protextify
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

