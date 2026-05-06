// src/components/home/TestimonialSection.jsx

import { Container, Card, CardContent } from "../../components";
import { Star, Quote } from "lucide-react";
import fotoEsa from "@/assets/esa.webp";
import fotoRaisya from "@/assets/raisya.webp";
import fotoRenti from "@/assets/renti.webp";

/**
 * Komponen TestimonialSection
 * Menampilkan kumpulan testimonial dari pengguna Protextify.
 * Testimonial ditampilkan dalam bentuk kartu dengan nama, peran, isi testimonial, rating, dan avatar.
 */
export default function TestimonialSection() {
  // Daftar testimonial yang akan ditampilkan pada halaman
  const testimonials = [
    {
      name: "Esa Ghanim Fadhallah, S. Pi., M. Si.",
      role: "Dosen Teknologi Hasil Pertanian",
      content:
        "Setelah menggunakan platform ini, saya merasa sangat terbantu dalam mencapai target pembelajaran yang saya harapkan dari mahasiswa saya. Platform ini membantu mahasiswa saya untuk lebih memahami substansi tugas yang saya berikan. Saya paling senang dengan fitur anti-copy paste ini, karena memungkinkan untuk digunakan sebagai lembar jawaban essay Ujian Tengah Semester ataupun Ujian Akhir Semester.",
      rating: 5,
      avatar: fotoEsa,
    },
    {
      name: "Raisya Qonita",
      role: "Mahasiswa Universitas Lampung",
      content:
        "fitur-fitur yang ada di protextify sangat menarik, terutama pada editor teks dan pendeteksi plagiarisme, fitur tersebut sangat berpengaruh untuk diri saya sebagai mahasiswa untuk membuat tugas dengan orisinalitas tinggi.",
      rating: 4,
      avatar: fotoRaisya,
    },
    {
      name: "Renti Oktaria, M.Pd",
      role: "Dosen PG PAUD",
      content:
        "Inovasi yang sangat bagus, saya tertarik untuk menggunakan platform ini disaat nantinya akan aktif mengajar, karena menurut saya paltform ini sangat membantu terutama dizaman sekarang banyak mahasiswa mengerjakan tugas itu hanya mengandalkan copy paste dari AI secara instan dan juga kemampuan berpikir kritis berkurang.",
      rating: 5,
      avatar: fotoRenti,
    },
  ];

  return (
    // Section utama untuk testimonial
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Container>
        {/* Header section: Judul dan deskripsi testimonial */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Apa Kata Mereka?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dengarkan pengalaman dari para pendidik dan mahasiswa yang telah
            menggunakan Protextify
          </p>
        </div>

        {/* Grid untuk menampilkan setiap testimonial dalam bentuk kartu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
            >
              <CardContent className="p-8">
                {/* Icon kutipan di bagian atas kartu */}
                <Quote className="w-8 h-8 text-[#23407a] mb-4" />

                {/* Bagian rating: menampilkan bintang sesuai rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                {/* Isi testimonial */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Bagian identitas pemberi testimonial */}
                <div className="flex items-center">
                  {/* Avatar berupa foto asli */}
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Nama dan peran pemberi testimonial */}
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
