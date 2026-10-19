# ADR-001: Pemilihan Tech Stack & Arsitektur Modular (Trail-to-Road Effort Converter MVP)

**Dokumen:** `docs/architecture/adr-001-tech-stack.md`  
**Tanggal:** 19 Oktober 2026  
**Penulis:** The Builder (Principal Fullstack Engineer)  
**Status:** Accepted  
**Referensi:** `docs/product/prd-trail-effort-converter.md`, `docs/design/ia.md`, `docs/design/design-system.md`

---

## 1. Konteks & Kebutuhan Produk

**Trail-to-Road Effort Converter** adalah aplikasi web utilitas *pre-run planning* tanpa autentikasi (*zero-friction*) yang mengonversi spesifikasi rute lari *trail* (Jarak horizontal `km`, Elevation Gain `D+ m`, dan karakteristik teknis permukaan jalur) menjadi **Ekuivalen Jarak Jalan Raya Datar (*Km-Effort*)** serta **Estimasi Waktu Tempuh & Effective Trail Pace**.

Karakteristik teknis utama dari PRD dan spesifikasi UI/UX:
1. **100% Client-Side Reactive Calculation (`< 16ms` latency):** Seluruh rumus harus dieksekusi secara instan saat pengguna mengetik tanpa *network round-trip* atau *loading spinner*.
2. **Offline-Resilient & Mobile-First:** Pelari sering membuka alat ini di area *trailhead* atau kaki gunung dengan sinyal seluler lemah. Begitu halaman termuat, seluruh kalkulasi wajib tetap berjalan meskipun koneksi terputus.
3. **Zero Backend State di MVP:** Tidak ada autentikasi, database riwayat lari, atau upload file GPX pada tahap validasi hipotesis awal.
4. **Kemudahan Pengujian & Pemeliharaan (Clean Architecture):** Logika perhitungan domain (rumus ITRA Km-Effort, pengali medan, konversi pace, klasifikasi kategori ITRA, dan validasi batas input) harus terpisah secara tegas dari komponen UI agar dapat diuji secara independen dengan *unit test* yang deterministik.
5. **Kemudahan Deployment & Containerization:** Harus mudah di-*build* menjadi *production bundle* yang ringan, dilengkapi *health check endpoint/file* (`/health.json`), dan siap dijalankan di dalam *container* (Docker + Nginx/Caddy) maupun *static edge hosting*.

---

## 2. Opsi Tech Stack yang Dipertimbangkan

### Opsi A: Vite + React 18 + TypeScript (Strict) + Tailwind CSS v3 + Vitest *(Dipilih)*
- **Arsitektur:** Single-Page Application (SPA) statis yang dikompilasi menjadi aset HTML/CSS/JS murni (`dist/`) dengan pemisahan direktori `src/domain/` (pure TypeScript calculation engine) dan `src/components/` (React UI layer).
- **Kelebihan:**
  - *Build time* dan *test runner* sangat cepat (Vite + Vitest berbagi konfigurasi pipeline yang sama).
  - Ukuran *bundle* sangat kecil dan menghasilkan artefak statis murni yang bisa disajikan oleh web server ringan (Nginx/Caddy) dengan konsumsi RAM minimal (`< 20MB` di container).
  - Tidak ada *server-side runtime overhead* untuk aplikasi yang 100% berfokus pada kalkulasi reaktif *client-side*.
- **Kekurangan:**
  - Jika di masa depan (V2/V3) membutuhkan *server-side API routes* (misal integrasi OAuth Strava atau penyimpanan database), perlu menambahkan backend service terpisah atau *serverless functions*.

### Opsi B: Next.js (App Router) + TypeScript + Tailwind CSS + Vitest
- **Arsitektur:** Fullstack React framework dengan *Server Components* (RSC) dan *Client Components*.
- **Kelebihan:**
  - Memiliki *API Routes* bawaan jika kelak membutuhkan backend di repositori yang sama.
  - Optimasi *font* dan metadata SEO terintegrasi.
- **Kekurangan:**
  - *Over-engineering* untuk MVP kalkulator murni *client-side*: karena hampir seluruh halaman adalah *interactive form & reactive dashboard*, komponen utama tetap harus ditandai `"use client"`.
  - Ukuran image Docker Node.js standalone lebih besar dan waktu *build* lebih lambat dibanding Vite statis.

### Opsi C: Vanilla HTML/TS tanpa UI Framework
- **Arsitektur:** Manipulasi DOM manual menggunakan TypeScript murni.
- **Kelebihan:**
  - Nol *runtime framework overhead*.
- **Kekurangan:**
  - Mengelola 9 *system states* (Default pre-populated, Empty state, Invalid per-field error state, Extreme Ultra Warning banner, Active Preset matching, Visual Comparison Bar, dan Clipboard permission fallback modal) dengan manipulasi DOM manual rawan menimbulkan *state desynchronization bug* dan sulit dipelihara saat fitur berkembang.

---

## 3. Keputusan Arsitektur

Kami memilih **Opsi A: Vite + React + TypeScript (`strict: true`) + Tailwind CSS + Vitest + Testing Library**.

### Struktur Modul (Clean Architecture Tanpa Over-Engineering)

```text
effort-run-calculator/
├── docs/
│   ├── architecture/
│   │   └── adr-001-tech-stack.md      # Dokumen keputusan arsitektur ini
│   ├── design/                        # Artefak IA, Flows, Design System, Prototype
│   └── product/                       # PRD Trail-to-Road Effort Converter
├── public/
│   └── health.json                    # Static health check endpoint untuk Docker/orchestrator
├── src/
│   ├── domain/                        # PURE DOMAIN LAYER (0% React/DOM dependency)
│   │   ├── types.ts                   # Kontrak tipe data, opsi medan, preset, state validasi
│   │   ├── constants.ts               # Konstanta batas validasi, daftar Quick Presets, tabel ITRA
│   │   ├── calculator.ts              # Pure functions: ITRA Km-Effort, terrain adjustment, pace, summary
│   │   └── __tests__/
│   │       └── calculator.test.ts     # Comprehensive unit tests untuk domain & edge cases
│   ├── components/                    # PRESENTATION / UI LAYER
│   │   ├── Header.tsx                 # Zona 1: Brand identity, ITRA badge, navigasi metodologi
│   │   ├── QuickPresetsBar.tsx        # Zona 2: 1-click preset pills dengan active state matching
│   │   ├── RouteInputPanel.tsx        # Zona 3: Input Jarak, D+, Terrain Radio Cards, Pace, Reset
│   │   ├── ResultDashboard.tsx        # Zona 4: Hero metric, Visual Comparison Bar, Pace card, Warnings, Copy CTA
│   │   └── MethodologySection.tsx     # Zona 5: Edukasi rumus & tabel referensi kategori ITRA
│   ├── App.tsx                        # State orchestration & integrasi antara Domain dan UI
│   ├── main.tsx                       # Entry point React
│   └── index.css                      # Tailwind directives & custom utility (tabular-nums)
├── index.html                         # Entry HTML (bahasa Indonesia, font Plus Jakarta Sans & JetBrains Mono)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 4. Konsekuensi & Mitigasi Trade-Off

### Konsekuensi Positif
- **Kemudahan Pengujian (High Testability):** Seluruh rumus di `src/domain/calculator.ts` adalah *pure functions* (input masuk $\rightarrow$ output keluar tanpa efek samping), sehingga dapat diuji 100% menggunakan Vitest dalam hitungan milidetik.
- **Performa & Aksesibilitas Tinggi:** Pemisahan state yang bersih di React memastikan atribut aksesibilitas (`aria-invalid`, `aria-describedby`, `aria-live="polite"`, navigasi keyboard radio group) ter-render secara konsisten di setiap perubahan input.
- **Kesiapan DevOps:** Output `dist/` beserta `public/health.json` memudahkan `devops-specialist` membungkus aplikasi ke dalam *multi-stage Dockerfile* (Node.js build stage $\rightarrow$ Nginx/Alpine production stage) dengan *healthcheck* HTTP standar.

### Konsekuensi Negatif & Mitigasi
- **Ketiadaan Backend Server di MVP:** Jika setelah 14 hari validasi metrik mencapai sinyal **GO** dan tim memutuskan membangun fitur *GPX Route Analyzer* (Parking Lot #3), pemrosesan file GPX masih dapat dilakukan 100% di sisi klien menggunakan Web Worker API tanpa perlu merombak arsitektur Vite ini.
