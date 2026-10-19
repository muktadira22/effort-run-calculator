# Trail-to-Road Effort Converter (`trail-effort-converter`)

Kalkulator web instan (*zero-login*, *mobile-first*, *offline-capable*) untuk menerjemahkan spesifikasi rute lari **Trail** (**Jarak horizontal `km`**, **Elevation Gain `D+ m`**, dan **Karakteristik Teknis Medan**) menjadi **Ekuivalen Jarak Lari Jalan Raya Datar (*Km-Effort*)** serta **Estimasi Waktu Tempuh & Effective Trail Pace**.

---

## Fitur Utama (MVP Scope)

1. **Konversi Beban Real-Time (ITRA Km-Effort & Adjusted Road Equivalent):**
   - Menghitung standar resmi **ITRA Km-Effort** ($\text{Jarak} + \text{D+}/100$).
   - Menerapkan pengali permukaan jalur (**Terrain Technicality Modifier**):
     - **Runable / Fire Road (`+0%` / `×1.00`)**
     - **Moderate Singletrack (`+10%` / `×1.10`)**
     - **Technical / Rocky / Muddy (`+20%` / `×1.20`)**
   - Menampilkan persentase ekstra beban dibanding jarak datar, **Visual Comparison Bar**, **Kategori Lomba ITRA (`XXS` s/d `XXL`)**, dan pembanding jarak lomba jalan raya (*10K*, *Half Marathon 21.1K*, *Full Marathon 42.2K*).
2. **Estimasi Waktu Tempuh & Effective Trail Pace:**
   - Mengonversi input opsional **Flat Road Pace (`mm:ss /km`)** menjadi perkiraan total waktu selesai (`jam:menit`) dan *average pace* di jalur trail (`Effective Trail Pace`).
3. **Quick Presets Rute & Lomba Ikonik (1-Klik):**
   - *10K Short Trail (D+ 400m)*, *Tahura / 21K Half Trail (D+ 1.000m)*, *Siksorogo / 15K Steep (D+ 1.200m)*, dan *50K Ultra Mountain (D+ 3.000m)*.
4. **System States & Penanganan Edge Cases Lengkap:**
   - *Pre-populated Default State*, *Empty State* (`Kosongkan`), *Reset Default*, *Inline Validation Error State* (batas jarak `0.1–500 km`, elevasi `0–25.000 m`, pace `02:30–20:00 /km`), *Extreme Ultra Fatigue Warning* (`>= 50 Km-Effort` atau `>= 42.2 km`), dan *Copy Summary to WhatsApp/Strava* dengan *Permission Denied Fallback Textarea*.

---

## Arsitektur & Struktur Proyek

Mengacu pada [ADR-001 (`docs/architecture/adr-001-tech-stack.md`)](docs/architecture/adr-001-tech-stack.md), logika kalkulasi domain dipisahkan secara murni dari komponen UI React:

```text
├── docs/
│   ├── architecture/adr-001-tech-stack.md       # Architecture Decision Record
│   ├── design/                                  # IA, User Flows, Wireframe, Design System, Prototype
│   └── product/prd-trail-effort-converter.md    # Product Requirements Document (PRD)
├── public/
│   └── health.json                              # Static healthcheck endpoint (/health.json)
├── src/
│   ├── domain/                                  # Pure TypeScript Domain & Calculation Engine
│   │   ├── types.ts                             # Kontrak data & tipe evaluasi state
│   │   ├── constants.ts                         # Konstanta batas validasi, preset, kategori ITRA
│   │   ├── calculator.ts                        # Pure functions kalkulasi & validasi
│   │   └── __tests__/calculator.test.ts         # Unit tests domain logic
│   ├── components/                              # Modular React UI Components
│   │   ├── Header.tsx                           # Zona 1: Header & identitas standar ITRA
│   │   ├── QuickPresetsBar.tsx                  # Zona 2: Tombol preset skenario 1-klik
│   │   ├── RouteInputPanel.tsx                  # Zona 3: Form input rute, medan, dan pace
│   │   ├── ResultDashboard.tsx                  # Zona 4: Dashboard hasil, visual bar & copy summary
│   │   ├── MethodologySection.tsx               # Zona 5: Penjelasan rumus & tabel kategori ITRA
│   │   └── __tests__/App.test.tsx               # Integration tests komponen UI & state transitions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                                # Design tokens Tailwind CSS v4
└── package.json
```

---

## Cara Menjalankan, Menguji & Mem-build

### Prasyarat
- **Node.js** `>= 20.x` (direkomendasikan `v22` atau `v24` LTS)
- **npm** `>= 10.x`

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan Server Pengembangan (Development)
```bash
npm run dev
```
Aplikasi akan berjalan secara default di `http://localhost:5173`.

### 3. Menjalankan Pemeriksaan Kualitas (Typecheck, Lint, Unit & Integration Tests)
```bash
# Type-check menggunakan TypeScript strict mode
npm run typecheck

# Linting menggunakan ESLint
npm run lint

# Menjalankan seluruh unit & UI integration test dengan Vitest
npm test
```

### 4. Production Build & Preview
```bash
# Kompilasi aset statis produksi ke direktori dist/
npm run build

# Menjalankan server preview untuk menguji hasil build produksi
npm run preview
```

---

## Catatan Deployment & Containerization

- Hasil `npm run build` menghasilkan bundle statis murni di dalam direktori `dist/`.
- Tersedia file statis `dist/health.json` (diakses melalui HTTP `GET /health.json` dengan respons `{"status":"ok","service":"trail-effort-converter","version":"1.0.0"}`) yang siap digunakan sebagai target `HEALTHCHECK` pada Docker/Nginx maupun platform PaaS.
