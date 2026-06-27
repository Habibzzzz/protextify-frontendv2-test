# Alur PWA dan SPA Frontend Protextify

Frontend Protextify menggunakan dua konsep sekaligus:

- SPA atau Single Page Application untuk navigasi dan rendering halaman.
- PWA atau Progressive Web App untuk installability, manifest, service worker,
  dan caching asset.

## 1. Bagian yang Menggunakan Konsep SPA

SPA berarti aplikasi hanya memuat satu file HTML utama, lalu perpindahan halaman
diatur oleh JavaScript di browser tanpa reload penuh dari server.

### File utama SPA

- `index.html`
- `src/main.jsx`
- `src/router/index.jsx`
- `src/layouts/RootLayout.jsx`
- `src/layouts/AuthLayout.jsx`
- `src/layouts/DashboardLayout.jsx`
- `default.conf`

### Alur SPA

```text
Browser membuka protextify.id
  -> Nginx mengirim index.html
  -> index.html memuat /src/main.jsx atau bundle hasil build
  -> main.jsx me-render React ke <div id="root">
  -> RouterProvider memakai router dari src/router/index.jsx
  -> React Router menentukan route aktif
  -> Layout dipilih
  -> Page dirender
  -> Service memanggil backend API jika butuh data
```

### Kenapa ini SPA

1. `index.html` hanya punya satu root:

```html
<div id="root"></div>
```

2. `src/main.jsx` memasang React ke root tersebut:

```jsx
ReactDOM.createRoot(document.getElementById("root")).render(...)
```

3. Routing dilakukan di client dengan React Router:

```jsx
<RouterProvider router={router} />
```

4. Route didefinisikan di:

```text
src/router/index.jsx
```

5. Nginx melakukan fallback semua route ke `index.html`:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Fallback ini penting. Tanpa fallback, route seperti `/dashboard/assignments`
akan dianggap file/folder server dan bisa 404 saat browser di-refresh.

### Contoh alur route SPA

```text
/dashboard/assignments/123
  -> Nginx fallback ke index.html
  -> React app start
  -> React Router membaca path /dashboard/assignments/123
  -> ProtectedRoute mengecek login dan role STUDENT
  -> DashboardLayout dirender
  -> pages/student/AssignmentDetail.jsx dirender
```

## 2. Bagian yang Menggunakan Konsep PWA

PWA berarti web app punya fitur mirip aplikasi native, seperti bisa di-install,
punya icon, manifest, theme color, splash screen, dan service worker untuk
caching.

### File utama PWA

- `vite.config.js`
- `index.html`
- `public/manifest.json`
- `public/icons/*`
- `public/favicon.ico`
- `default.conf`
- `package.json`

### Plugin PWA

File: `vite.config.js`

Project memakai:

```js
import { VitePWA } from "vite-plugin-pwa";
```

Lalu plugin dipasang di konfigurasi Vite:

```js
VitePWA({
  registerType: "autoUpdate",
  manifest: {...},
  workbox: {...}
})
```

### Alur PWA

```text
User membuka website
  -> Browser membaca index.html
  -> Browser membaca manifest PWA
  -> VitePWA mendaftarkan service worker saat build production
  -> Workbox mengatur cache HTML dan static assets
  -> Browser menampilkan opsi install jika kriteria PWA terpenuhi
  -> Saat app dibuka lagi, asset bisa dilayani dari cache
```

### Manifest

Manifest mendefinisikan identitas aplikasi:

- `name`
- `short_name`
- `description`
- `theme_color`
- `background_color`
- `display: "standalone"`
- `scope`
- `start_url`
- `icons`

Ada dua sumber manifest yang perlu diperhatikan:

- `public/manifest.json`
- konfigurasi `manifest` di `vite.config.js`

Konfigurasi `VitePWA` akan menghasilkan manifest untuk build production.
Sementara `index.html` juga punya:

```html
<link rel="manifest" href="/manifest.json" />
```

### Service worker dan cache

File: `vite.config.js`

PWA memakai Workbox runtime caching.

Untuk navigasi HTML:

```js
handler: "NetworkFirst"
cacheName: "html-cache"
```

Artinya browser mencoba ambil HTML terbaru dari network lebih dulu. Jika network
lambat atau gagal, cache dapat dipakai sebagai fallback.

Untuk asset static:

```js
handler: "StaleWhileRevalidate"
cacheName: "static-assets-cache"
```

Artinya asset seperti JS, CSS, image, font bisa muncul cepat dari cache sambil
browser memperbarui cache di background.

### PWA meta tags

File: `index.html`

Meta tag yang mendukung PWA:

```html
<meta name="theme-color" content="#23407a" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="Protextify" />
<link rel="manifest" href="/manifest.json" />
```

Ada juga Apple splash screens dan Apple touch icons untuk pengalaman install di
iOS.

## 3. Hubungan SPA dan PWA

SPA dan PWA bekerja di layer yang berbeda.

SPA mengatur:

- route
- layout
- rendering halaman
- data fetching
- proteksi route
- pengalaman navigasi tanpa reload penuh

PWA mengatur:

- manifest
- icon aplikasi
- install prompt
- standalone display
- service worker
- caching asset
- update cache

Alur gabungannya:

```text
User membuka /dashboard/assignments
  -> PWA/service worker bisa melayani asset dari cache
  -> Nginx fallback ke index.html
  -> React SPA aktif
  -> React Router menentukan halaman
  -> ProtectedRoute validasi login dan role
  -> Page student dirender
  -> Service memanggil backend API
```

## 4. Kesimpulan

Frontend ini adalah SPA karena navigasi utama dikelola oleh React Router di sisi
client melalui satu entry HTML.

Frontend ini juga PWA karena memakai `vite-plugin-pwa`, manifest, icon, meta tag
PWA, Workbox caching, dan mode `display: standalone`.

Bagian SPA paling utama:

- `index.html`
- `src/main.jsx`
- `src/router/index.jsx`
- `src/layouts/*`
- `default.conf`

Bagian PWA paling utama:

- `vite.config.js`
- `public/manifest.json`
- `public/icons/*`
- `index.html`
