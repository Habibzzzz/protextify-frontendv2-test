// Konfigurasi WhatsApp untuk Floating Button
export const WHATSAPP_CONFIG = {
  // Nomor WhatsApp (format: 62 + nomor tanpa 0 di depan)
  // Contoh: 6281234567890 untuk nomor 081234567890
  phoneNumber: "6282363343710",
  
  // Pesan default yang akan dikirim
  defaultMessage: "Halo! Saya ingin bertanya tentang Protextify.",
  
  // Nama tim support
  supportTeamName: "Tim Support Protextify",
  
  // Jam operasional (opsional)
  operatingHours: "Senin - Jumat, 08:00 - 17:00 WIB",
  
  // Pesan saat di luar jam operasional
  afterHoursMessage: "Halo! Terima kasih telah menghubungi kami. Tim support akan merespons pada jam operasional (Senin - Jumat, 08:00 - 17:00 WIB).",
};

// Fungsi untuk generate URL WhatsApp
export const generateWhatsAppUrl = (customMessage = null) => {
  const message = customMessage || WHATSAPP_CONFIG.defaultMessage;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`;
};

// Fungsi untuk cek apakah dalam jam operasional
export const isWithinOperatingHours = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
  const hour = now.getHours();
  
  // Senin - Jumat (1-5), jam 08:00 - 17:00
  return day >= 1 && day <= 5 && hour >= 8 && hour < 17;
};

export default WHATSAPP_CONFIG;
