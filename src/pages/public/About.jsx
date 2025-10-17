// src/pages/public/About.jsx
import { Link } from "react-router-dom";
import {
  Target,
  Eye,
  Heart,
  Users,
  Code,
  Shield,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Award,
  TrendingUp,
  Globe,
  Lightbulb,
  Star,
} from "lucide-react";
import {
  Button,
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Grid,
  Badge,
  AnimatedCounter,
} from "../../components";

// Import team photos
import esaPhoto from "../../assets/people/esa.png";
import lukmanPhoto from "../../assets/people/lukman.png";
import kerinPhoto from "../../assets/people/kerin.png";
import habibPhoto from "../../assets/people/habib.png";
import asepPhoto from "../../assets/people/asep.png";
import arsitPhoto from "../../assets/people/arsit.png";

export default function About() {
  const values = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Integritas Akademik",
      description:
        "Kami berkomitmen menjaga standar tertinggi dalam integritas akademik dan mendukung pembelajaran yang jujur.",
      color: "blue",
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Inovasi Teknologi",
      description:
        "Menggunakan teknologi AI terdepan untuk memberikan solusi deteksi plagiarisme yang akurat dan efisien.",
      color: "purple",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Kolaborasi",
      description:
        "Memfasilitasi kolaborasi yang sehat antara pengajar dan siswa dalam proses pembelajaran.",
      color: "green",
    },
  ];

  const achievements = [
    {
      icon: <Users className="w-8 h-8" />,
      value: 500,
      label: "Pengguna Aktif",
      suffix: "+",
      color: "blue",
    },
    // {
    //   icon: <Globe className="w-8 h-8" />,
    //   value: 50,
    //   label: "Institusi Partner",
    //   suffix: "+",
    //   color: "green",
    // },
    {
      icon: <Award className="w-8 h-8" />,
      value: 99,
      label: "Akurasi AI",
      suffix: "%",
      color: "purple",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: 24,
      label: "Uptime",
      suffix: "/7",
      color: "yellow",
    },
  ];

  const team = [
    {
      name: "Lukman Hakim",
      role: "Chief Executive Officer",
      description:
        "Chief Executive Officer berperan dalam mengatur dan mengarahkan operasional perusahaan secara keseluruhan.",
      skills: ["Leadership", "Team Work", "Branding", "Social Media"],
      avatar: "👨‍💻",
      photo: "/src/assets/people/lukman.png", // Ganti dengan URL foto atau path foto, contoh: "/images/esa.jpg" atau "https://example.com/foto.jpg"
    },
    {
      name: "Kerina Bakarudin",
      role: "Chief Technology Officer",
      description:
        "Chief Technology Officer bertugas mengelola dan mengembangkan teknologi terkini untuk meningkatkan performa dan keamanan platform.",
      skills: ["Social Media", "Frontend Development", "Branding"],
      avatar: "🤖",
      photo: "/src/assets/people/kerin.png", // Ganti dengan URL foto atau path foto, contoh: "/images/esa.jpg" atau "https://example.com/foto.jpg"
    },
    {
      name: "Habib Pandya",
      role: "Chief Operating Officer",
      description:
        "Chief Operating Officer bertugas mengelola dan mengoperasikan operasional perusahaan secara efisien dan efektif.",
      skills: [
        "Team Work",
        "Educational Tech",
        "Analytics",
        "Frontend Development",
      ],
      avatar: "🎯",
      photo: "/src/assets/people/habib.png", // Ganti dengan URL foto atau path foto, contoh: "/images/esa.jpg" atau "https://example.com/foto.jpg"
    },
    {
      name: "Arya Setia Pratama",
      role: "Chief Marketing Officer",
      description:
        "Chief Marketing Officer bertugas mengelola dan mengembangkan strategi pemasaran perusahaan untuk meningkatkan brand awareness dan pertumbuhan bisnis.",
      skills: ["Marketing", "Sales", "Branding", "Backend Developer"],
      avatar: "🔍",
      photo: "/src/assets/people/asep.png", // Ganti dengan URL foto atau path foto, contoh: "/images/esa.jpg" atau "https://example.com/foto.jpg"
    },
    {
      name: "Arsyitha Alifia",
      role: "Chief Financial Officer",
      description:
        "Chief Financial Officer bertugas mengelola dan mengembangkan strategi keuangan perusahaan untuk meningkatkan kesehatan keuangan dan pertumbuhan bisnis.",
      skills: ["Finance", "Accounting", "Tax", "Social Media"],
      avatar: "💬",
      photo: "/src/assets/people/arsit.png", // Ganti dengan URL foto atau path foto, contoh: "/images/esa.jpg" atau "https://example.com/foto.jpg"
    },
    {
      name: "Esa Ghanim Fadhallah S.Pi, M.Si",
      role: "Supervisor",
      description:
        "Supervisor bertugas memberikan bimbingan dan pengawasan terhadap seluruh operasional perusahaan untuk memastikan kualitas dan standar yang tinggi.",
      skills: ["Supervision", "Mentoring", "Quality Control"],
      avatar: "👨‍🏫",
      photo: "/src/assets/people/esa.png", // Ganti dengan URL foto atau path foto, contoh: "/images/esa.jpg" atau "https://example.com/foto.jpg"
    },
  ];

  const techStack = {
    frontend: [
      {
        name: "React 19.1.0",
        description: "Modern UI library dengan hooks terbaru",
      },
      { name: "Vite 7.1.7", description: "Build tool yang cepat dan efisien" },
      {
        name: "TailwindCSS 4.1.13",
        description: "Utility-first CSS framework",
      },
      {
        name: "React Router DOM",
        description: "Routing untuk SPA yang powerful",
      },
      { name: "Socket.IO Client", description: "Real-time communication" },
    ],
    backend: [
      {
        name: "NestJS + TypeScript",
        description: "Enterprise-grade Node.js framework",
      },
      {
        name: "PostgreSQL + Prisma",
        description: "Robust database dengan type-safe ORM",
      },
      {
        name: "Winston AI API",
        description: "Advanced plagiarism detection engine",
      },
      { name: "Redis + BullMQ", description: "Caching dan job queue system" },
      { name: "JWT + Passport", description: "Secure authentication system" },
    ],
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Konsisten dengan Home */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#0f1b3a]">
        {/* Background Elements - Same as Home */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
        </div>

        <Container className="relative z-10 py-20">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="mb-8 flex justify-center">
              <Badge
                variant="glass"
                className="px-4 py-2 text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Tentang Platform
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Membangun Masa Depan{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Pendidikan
              </span>
              <br />
              yang Jujur dan Berkualitas
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
              Protextify adalah platform deteksi plagiarisme yang dirancang
              khusus untuk mendukung integritas akademik dan meningkatkan
              kualitas pembelajaran di era digital dengan teknologi AI terdepan.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link to="/auth/register">
                <Button
                  size="xl"
                  className="group bg-white text-[#23407a] hover:bg-gray-50 shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105"
                >
                  Mulai Bergabung
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Button
                size="xl"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <Star className="w-5 h-5 mr-2" />
                Lihat Demo
              </Button>
            </div>

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center group">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 group-hover:scale-110 transition-all duration-300 ${
                      achievement.color === "blue"
                        ? "bg-blue-500/20 text-blue-400"
                        : achievement.color === "green"
                        ? "bg-green-500/20 text-green-400"
                        : achievement.color === "purple"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    <AnimatedCounter
                      end={achievement.value}
                      suffix={achievement.suffix}
                    />
                  </div>
                  <p className="text-white/70 font-medium">
                    {achievement.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Mission & Vision - Enhanced Design */}
      <section className="py-24 bg-white">
        <Container>
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6">
              🎯 Misi & Visi
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Komitmen Kami untuk{" "}
              <span className="text-[#23407a]">Pendidikan Berkualitas</span>
            </h2>
          </div>

          <Grid cols={1} lgCols={2} gap={12} className="place-items-center">
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 max-w-10/12">
              <div className="absolute inset-0 bg-gradient-to-br from-[#23407a]/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <CardHeader className="relative z-10">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-[#23407a]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#23407a] group-hover:text-white transition-all duration-300 group-hover:scale-110 text-[#23407a]">
                    <Target className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl group-hover:text-[#23407a] transition-colors">
                    Misi Kami
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-gray-600 leading-relaxed text-lg">
                  Menyediakan solusi teknologi yang membantu institusi
                  pendidikan menjaga integritas akademik melalui deteksi
                  plagiarisme yang akurat, sambil memberikan pengalaman
                  pembelajaran yang modern dan efisien bagi pengajar dan siswa.
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 max-w-10/12">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-[#23407a]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <CardHeader className="relative z-10">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 text-purple-600">
                    <Eye className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl group-hover:text-purple-600 transition-colors">
                    Visi Kami
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-gray-600 leading-relaxed text-lg">
                  Menjadi platform terdepan dalam solusi deteksi plagiarisme dan
                  manajemen tugas akademik di Indonesia, yang memungkinkan
                  setiap institusi pendidikan menciptakan lingkungan
                  pembelajaran yang jujur, inovatif, dan berkualitas tinggi.
                </p>
              </CardContent>
            </Card>
          </Grid>
        </Container>
      </section>

      {/* Values Section - Enhanced */}
      <section className="py-24 bg-gradient-to-r from-gray-50 to-blue-50/30">
        <Container>
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6">
              ✨ Nilai-nilai Kami
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Prinsip yang{" "}
              <span className="text-[#23407a]">Memandu Langkah Kami</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Setiap pengembangan Protextify didasarkan pada nilai-nilai
              fundamental yang kami junjung tinggi untuk menciptakan dampak
              positif dalam dunia pendidikan.
            </p>
          </div>

          <Grid cols={1} mdCols={3} gap={8}>
            {values.map((value, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#23407a]/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <CardContent className="p-8 relative z-10">
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 group-hover:scale-110 transition-all duration-300 ${
                      value.color === "blue"
                        ? "bg-blue-500/10 text-blue-600 group-hover:bg-blue-500 group-hover:text-white"
                        : value.color === "purple"
                        ? "bg-purple-500/10 text-purple-600 group-hover:bg-purple-500 group-hover:text-white"
                        : value.color === "green"
                        ? "bg-green-500/10 text-green-600 group-hover:bg-green-500 group-hover:text-white"
                        : value.color === "red"
                        ? "bg-red-500/10 text-red-600 group-hover:bg-red-500 group-hover:text-white"
                        : "bg-yellow-500/10 text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white"
                    }`}
                  >
                    {value.icon}
                  </div>
                  <CardTitle className="mb-4 text-xl group-hover:text-[#23407a] transition-colors">
                    {value.title}
                  </CardTitle>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Technology Section - Enhanced */}
      <section className="py-24 bg-white">
        <Container>
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6">
              🚀 Tech Stack
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Teknologi{" "}
              <span className="text-[#23407a]">Modern & Terdepan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Kami menggunakan stack teknologi terkini untuk memberikan performa
              optimal, keamanan tingkat enterprise, dan skalabilitas yang dapat
              diandalkan.
            </p>
          </div>

          <Grid cols={1} lgCols={2} gap={12}>
            {/* Frontend */}
            <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-[#23407a]/10 rounded-xl flex items-center justify-center text-[#23407a]">
                    <Code className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">
                    Frontend Development
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {techStack.frontend.map((tech, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-[#23407a]/5 transition-colors"
                    >
                      <div className="w-3 h-3 bg-[#23407a] rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {tech.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {tech.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Backend */}
            <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600">
                    <Shield className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">
                    Backend & AI Engine
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {techStack.backend.map((tech, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors"
                    >
                      <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {tech.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {tech.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Additional Features */}
          <div className="mt-16 bg-gradient-to-r from-[#23407a]/5 to-purple-500/5 rounded-2xl p-8 lg:p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Fitur Teknologi Unggulan
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Keunggulan teknis yang membuat Protextify menjadi pilihan
                terbaik untuk institusi pendidikan
              </p>
            </div>

            <Grid cols={1} mdCols={2} lgCols={4} gap={6}>
              {[
                {
                  icon: <CheckCircle className="w-6 h-6" />,
                  text: "99% Akurasi AI",
                  color: "green",
                },
                {
                  icon: <Sparkles className="w-6 h-6" />,
                  text: "Real-time Processing",
                  color: "blue",
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  text: "Enterprise Security",
                  color: "purple",
                },
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  text: "Auto Scaling",
                  color: "yellow",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                >
                  <div
                    className={`${
                      feature.color === "green"
                        ? "text-green-600"
                        : feature.color === "blue"
                        ? "text-blue-600"
                        : feature.color === "purple"
                        ? "text-purple-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <span className="font-medium text-gray-900">
                    {feature.text}
                  </span>
                </div>
              ))}
            </Grid>
          </div>
        </Container>
      </section>

      {/* Team Section - Enhanced */}
      <section className="py-24 bg-gradient-to-r from-gray-50 to-blue-50/30">
        <Container>
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6">
              👥 Tim Kami
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Profesional <span className="text-[#23407a]">Berpengalaman</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Tim multidisiplin yang berdedikasi mengembangkan solusi terbaik
              untuk dunia pendidikan dengan pengalaman bertahun-tahun di
              bidangnya masing-masing.
            </p>
          </div>

          {/* Second Row - 3 Cards (CEO, CTO, COO) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {team.slice(0, 3).map((member, index) => (
              <Card
                key={index + 3}
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#23407a]/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <CardContent className="p-8 text-center relative z-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#23407a] to-[#3b5fa4] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <span className="text-3xl">{member.avatar}</span>
                    )}
                  </div>
                  <CardTitle className="mb-2 text-xl group-hover:text-[#23407a] transition-colors">
                    {member.name}
                  </CardTitle>
                  <p className="text-[#23407a] font-semibold mb-4 text-lg">
                    {member.role}
                  </p>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {member.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-[#23407a]/10 text-[#23407a] rounded-full text-xs font-medium hover:bg-[#23407a] hover:text-white transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Third Row - 2 Cards (CMO, CFO) - Centered */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {team.slice(3, 6).map((member, index) => (
              <Card
                key={index + 4}
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#23407a]/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <CardContent className="p-8 text-center relative z-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#23407a] to-[#3b5fa4] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <span className="text-3xl">{member.avatar}</span>
                    )}
                  </div>
                  <CardTitle className="mb-2 text-xl group-hover:text-[#23407a] transition-colors">
                    {member.name}
                  </CardTitle>
                  <p className="text-[#23407a] font-semibold mb-4 text-lg">
                    {member.role}
                  </p>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {member.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-[#23407a]/10 text-[#23407a] rounded-full text-xs font-medium hover:bg-[#23407a] hover:text-white transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section - Same as Home */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#0f1b3a]"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>

        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl animate-float-delayed"></div>

        <Container className="relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white">
                <Heart className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Mari Bergabung</span>
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Siap Memulai Perjalanan{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Pendidikan Berkualitas?
              </span>
            </h2>

            <p className="text-xl text-white/80 mb-12 leading-relaxed">
              Mulai perjalanan Anda menuju pembelajaran yang lebih jujur dan
              berkualitas dengan teknologi deteksi plagiarisme terdepan.
              Bergabunglah dengan ribuan institusi yang telah mempercayai
              Protextify.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/auth/register">
                <Button
                  size="xl"
                  className="group bg-white text-[#23407a] hover:bg-gray-50 shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105"
                >
                  Mulai Sekarang
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
        </Container>
      </section>
    </div>
  );
}
