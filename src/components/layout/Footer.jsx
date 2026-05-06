// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import { Camera as Instagram, Phone, Mail, Heart, ArrowRight } from "lucide-react";
import { Button, Container } from "../../components";
import logoPutih from "@/assets/logo-protextify-putih.png";
import komdigiLogo from "@/assets/logo-komdigi.png";
import pseLogo from "@/assets/logo-pse.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Tentang Kami", href: "/about" },
    { label: "Harga", href: "/pricing" },
  ];

  const support = [
    { label: "Bantuan", href: "/help" },
    // { label: "Dokumentasi", href: "/docs" },
  ];

  const legal = [
    { label: "Kebijakan Privasi", href: "/privacy" },
    { label: "Syarat & Ketentuan", href: "/terms" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#0f1b3a] text-white overflow-hidden">
      {/* Background Pattern - Subtle */}
      <div className="absolute inset-0 bg-grid-white/[0.01] bg-[size:40px_40px]"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>

      <Container className="relative z-10">
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <div className="flex items-center mb-6">
                <img src={logoPutih} alt="Protextify" className="h-16 w-auto" />
              </div>
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-sm">
                Platform deteksi plagiarisme dengan teknologi AI terdepan untuk
                institusi pendidikan.
              </p>
              {/* Social Links */}
              <div className="space-y-2">
                <a
                  href="mailto:protextify2025@gmail.com"
                  className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors text-sm"
                  aria-label="Email Protextify"
                >
                  <Mail className="h-5 w-5" />
                  <span>protextify2025@gmail.com</span>
                </a>

                <a
                  href="https://www.instagram.com/protextify/"
                  className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Protextify"
                >
                  <Instagram className="h-5 w-5" />
                  <span>protextify</span>
                </a>

                <a
                  href="https://wa.me/6282363343710"
                  className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Protextify"
                >
                  <Phone className="h-5 w-5" />
                  <span>+62 823-6334-3710</span>
                </a>
              </div>
            </div>

            {/* Links Section */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Quick Links */}
              <div>
                <h3 className="font-semibold mb-4 text-white">Navigasi</h3>
                <ul className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className="text-white/60 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Support */}
              <div>
                <h3 className="font-semibold mb-4 text-white">Dukungan</h3>
                <ul className="space-y-3">
                  {support.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className="text-white/60 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Legal */}
              <div>
                <h3 className="font-semibold mb-4 text-white">Legal</h3>
                <ul className="space-y-3">
                  {legal.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className="text-white/60 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* CTA */}
              <div>
                <h3 className="font-semibold mb-4 text-white">
                  Mulai Sekarang
                </h3>
                <div className="space-y-3">
                  <Link to="/auth/register">
                    <Button
                      size="sm"
                      className="w-full bg-white text-[#23407a] hover:bg-gray-100 text-sm mb-4"
                    >
                      Daftar Gratis
                    </Button>
                  </Link>
                  <Link to="/auth/login">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-white/30 text-white hover:bg-white/10 text-sm"
                    >
                      Masuk
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Terdaftar Sebagai: Kominfo & PSE */}
          <div className="mt-8 pt-6">
            <p className="text-white/70 text-sm mb-3">
              Website ini telah terdaftar sebagai:
            </p>
            <div className="flex items-center space-x-4">
              <span className="bg-white rounded px-2 py-1 inline-flex items-center justify-center">
                <img
                  src={komdigiLogo}
                  alt="Kominfo - KOMDIGI"
                  className="h-6 object-contain"
                />
              </span>
              <span className="bg-white rounded px-2 py-1 inline-flex items-center justify-center">
                <img
                  src={pseLogo}
                  alt="PSE Lingkup Privat"
                  className="h-6 object-contain"
                />
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-white/60 text-sm">
                © {currentYear} Protextify. All rights reserved.
              </p>
            </div>
            <div className="flex items-center text-white/50 text-sm">
              <Heart className="h-4 w-4 text-red-400 mr-2" />
              <span>Made with love in Indonesia</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
