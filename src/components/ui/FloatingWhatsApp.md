# Floating WhatsApp Button

Komponen floating WhatsApp button yang muncul di semua halaman Protextify.

## Fitur

- ✅ Floating button dengan animasi smooth
- ✅ Tooltip yang menampilkan status online/offline
- ✅ Pulse animation untuk menarik perhatian
- ✅ Responsive design
- ✅ Auto-detect jam operasional
- ✅ Pesan default yang dapat dikustomisasi
- ✅ Mudah dikonfigurasi

## Konfigurasi

Edit file `src/utils/whatsappConfig.js` untuk mengubah:

```javascript
export const WHATSAPP_CONFIG = {
  phoneNumber: "6281234567890", // Ganti dengan nomor WhatsApp yang benar
  defaultMessage: "Halo! Saya ingin bertanya tentang Protextify.",
  supportTeamName: "Tim Support Protextify",
  operatingHours: "Senin - Jumat, 08:00 - 17:00 WIB",
  afterHoursMessage: "Halo! Terima kasih telah menghubungi kami...",
};
```

## Format Nomor WhatsApp

- Gunakan format internasional: `62` + nomor tanpa `0` di depan
- Contoh: `081234567890` → `6281234567890`
- Contoh: `085123456789` → `6285123456789`

## Cara Kerja

1. Button muncul di pojok kanan bawah semua halaman
2. Saat di-hover, menampilkan tooltip dengan status online/offline
3. Saat diklik, membuka WhatsApp dengan pesan default
4. Sistem otomatis mendeteksi jam operasional (Senin-Jumat, 08:00-17:00)
5. Pesan berbeda untuk jam operasional dan non-operasional

## Implementasi

Button sudah otomatis terintegrasi di semua layout:
- `RootLayout` (halaman public)
- `DashboardLayout` (halaman dashboard)
- `AuthLayout` (halaman login/register)

## Styling

Button menggunakan:
- Background: Green-500 (WhatsApp color)
- Size: 56px x 56px (w-14 h-14)
- Position: Fixed bottom-6 right-6
- Z-index: 50 (di atas semua elemen)
- Animasi: Framer Motion untuk smooth transitions

## Customization

Untuk mengubah styling, edit class CSS di `FloatingWhatsApp.jsx`:

```jsx
className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600..."
```

## Testing

1. Pastikan nomor WhatsApp sudah benar
2. Test di berbagai ukuran layar
3. Test hover dan click functionality
4. Test jam operasional vs non-operasional
