# Laporan Review QA & Keamanan: Trail-to-Road Effort Converter (MVP)

**Dokumen:** `docs/qa/review-2026-10-19-mvp.md`  
**Tanggal:** 19 Oktober 2026  
**Reviewer:** The Guardian (`quality-security-engineer`)  
**Target Review:** Source Code MVP (`src/`, `index.html`, `package.json`, `public/health.json`)  
**Referensi Kebenaran:**
- PRD: `docs/product/prd-trail-effort-converter.md`
- Design Specs: `docs/design/ia.md`, `docs/design/flows.md`, `docs/design/design-system.md`
- Architecture: `docs/architecture/adr-001-tech-stack.md`

---

## 1. Ringkasan Eksekutif & Keputusan Rilis

| Parameter Evaluasi | Status / Hasil |
| :--- | :--- |
| **Status Keputusan Rilis** | **GO (Siap untuk Deployment & Containerization)** |
| **Temuan Critical / High / Medium** | **0 Critical, 0 High, 0 Medium** |
| **Temuan Low / Info** | **2 Low, 2 Info** *(Non-blocking untuk rilis MVP)* |
| **Acceptance Criteria PRD (`US-1` – `US-4`)** | **100% Terpenuhi (4/4 User Stories)** |
| **Automated Test Suite (`vitest`)** | **27 / 27 Passed** (`2 test files`, durasi `< 1s`) |
| **Static Analysis (`tsc --noEmit` & `eslint`)** | **Lulus (0 Error, 0 Warning)** |
| **Dependency Vulnerability (`npm audit`)** | **0 Vulnerabilities Found** |

**Alasan Keputusan GO:**
Seluruh kriteria penerimaan fungsional (`US-1` s/d `US-4`), kesembilan *system states* dari spesifikasi desain, serta pemisahan *Clean Architecture* (`src/domain/` murni tanpa dependensi DOM dan `src/components/` untuk UI reaktif) telah diimplementasikan dengan presisi tinggi. Tidak ditemukan celah keamanan maupun bug fungsional dengan tingkat keparahan *Critical*, *High*, atau *Medium*.

---

## 2. Verifikasi Acceptance Criteria (PRD `US-1` s/d `US-4`)

| User Story | Kriteria Penerimaan (Acceptance Criteria) | Implementasi (`file:baris`) | Hasil Uji |
| :--- | :--- | :--- | :--- |
| **US-1: Konversi Instan Jarak & Elevasi ke Ekuivalen Road** | - Input `Jarak = 20` km & `D+ = 1000` m (Runable 0%) menghasilkan **30.0 km** (`+10.0 km` dari D+ / `+50%` ekstra beban) dan kategori **ITRA XS (20–34 Km-Effort)**.<br>- Mencegah nilai negatif/non-angka dengan pesan bantu jelas tanpa *crash*. | `src/domain/calculator.ts:134-175`<br>`src/domain/calculator.ts:212-253`<br>`src/components/RouteInputPanel.tsx:98-181` | **PASS** |
| **US-2: Penyesuaian Tingkat Kesulitan Medan (Terrain Technicality)** | - Mengubah pilihan medan ke *Moderate (+10%)* atau *Technical (+20%)* menampilkan **Adjusted Road Equivalent** (`33.0 km` / `36.0 km`) berdampingan secara transparan dengan **Base ITRA Km-Effort** (`30.0 km`). | `src/domain/constants.ts:14-45`<br>`src/domain/calculator.ts:139-146`<br>`src/components/ResultDashboard.tsx:251-295` | **PASS** |
| **US-3: Estimasi Waktu Tempuh & Effective Trail Pace** | - Dari ekuivalen `30.0 km` (20 km trail, D+ 1000m) dan `Flat Road Pace = 06:00 /km`, menghitung **Estimasi Waktu = 3 jam 00 menit** dan **Effective Trail Pace = 09:00 /km** (`+03:00 /km`). | `src/domain/calculator.ts:180-207`<br>`src/components/ResultDashboard.tsx:298-367` | **PASS** |
| **US-4: Preset Skenario & Bagikan Hasil (Zero-Friction Utility)** | - Klik *Quick Preset* mengisi form otomatis dan menampilkan hasil instan.<br>- Klik *"Salin Ringkasan"* menyalin teks ringkasan ke *clipboard* dengan umpan balik `"✓ Tersalin!"` (serta *fallback* manual jika izin ditolak). | `src/components/QuickPresetsBar.tsx:42-70`<br>`src/domain/calculator.ts:345-370`<br>`src/components/ResultDashboard.tsx:33-48, 407-470` | **PASS** |

---

## 3. Threat Model Ringan & Audit Keamanan (OWASP Top 10 Client-Side SPA)

Aplikasi ini adalah *100% Client-Side Single-Page Application (SPA)* tanpa autentikasi, tanpa penyimpanan database backend, dan tanpa pemrosesan file unggahan. Berikut adalah pemetaan ancaman dan hasil audit keamanan:

### 3.1 Permukaan Serangan & Mitigasi

| Kategori Ancaman (OWASP) | Vektor Serangan pada Kalkulator SPA | Mitigasi di Kode Produksi | Status Audit |
| :--- | :--- | :--- | :--- |
| **A03:2021 Injection / DOM-based XSS** | Pengguna atau skrip menyuntikkan payload HTML/JS (`<script>alert(1)</script>`) ke dalam input Jarak, Elevasi, atau Pace yang kemudian dirender ke layar atau area salin teks. | - Seluruh rendering menggunakan JSX standar React yang melakukan *auto-escaping*.<br>- Hasil scan `dangerouslySetInnerHTML`, `innerHTML`, `eval()`, dan `document.write` di `src/` = **0 penggunaan**.<br>- Input divalidasi ketat dengan `Number()` dan batas numerik di `evaluateCalculatorInput` sebelum masuk ke `formatShareableSummary`. | **AMAN (Pass)** |
| **Input Validation & Numeric Overflow / NaN / Infinity** | Input ekstrem (`Infinity`, `-Infinity`, `NaN`, `1e309`, `0`, angka negatif) yang menyebabkan pembagian dengan nol (`Division by Zero` pada rumus `% ekstra beban` atau `Effective Trail Pace`) dan merusak UI. | - `evaluateCalculatorInput` (`src/domain/calculator.ts:230-288`) menolak `NaN`, nilai `<= 0` untuk jarak, `< 0` untuk elevasi, serta membatasi `0.1 <= Jarak <= 500` km dan `0 <= D+ <= 25000` m.<br>- Karena `Infinity > 500`, input `Infinity` otomatis tertolak di gerbang validasi.<br>- `computeVisualBreakdown` memiliki *guard* `if (adjustedRoadEquivalentKm <= 0)` (`src/domain/calculator.ts:115`). | **AMAN (Pass)** |
| **Clipboard API Abuse & Permission Handling** | Kegagalan unhandled promise rejection ketika `navigator.clipboard.writeText` dipanggil pada konteks non-HTTPS atau WebView dengan izin terbatas. | - Dibungkus dalam blok `try / catch` asinkron (`src/components/ResultDashboard.tsx:37-47`).<br>- Jika gagal/ditolak, state beralih ke `'fallback'` yang menampilkan `<textarea readOnly>` berisi ringkasan teks yang otomatis ter-블ok (`select()`). | **AMAN (Pass)** |
| **A06:2021 Vulnerable and Outdated Components** | Kerentanan keamanan pada paket NPM pihak ketiga (`react`, `vite`, `tailwindcss`, `vitest`). | - Hasil eksekusi `rtk npm audit`: **found 0 vulnerabilities**.<br>- *Runtime dependencies* diminimalkan hanya `react` dan `react-dom`. | **AMAN (Pass)** |
| **A02/A07 Hardcoded Secrets & Sensitive Data Exposure** | Kredensial, API key, atau token rahasia yang tidak sengaja ter-*commit* di repositori atau bundel klien. | - Hasil scan pola `API_KEY`, `SECRET`, `TOKEN`, `PASSWORD` di seluruh repositori = **0 temuan**. | **AMAN (Pass)** |
| **A05:2021 Security Misconfiguration (Headers & CSP)** | Ketiadaan HTTP Security Headers (`Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`) saat disajikan di produksi. | - Karena aplikasi dikompilasi menjadi bundel statis (`dist/`), konfigurasi security headers perlu diterapkan pada level web server container (Nginx/Caddy) oleh `devops-specialist`. Dicatat sebagai temuan `LOW-02`. | **CATATAN DEVOPS** |

---

## 4. Pengujian Edge Cases, Boundary Values, & Sad Paths

Kami telah menguji dan menambahkan *automated test suite* untuk memverifikasi perilaku sistem pada kondisi batas dan *sad path* berikut:

1. **Boundary Values Jarak & Elevasi:**
   - Batas bawah valid: `0.1 km` dan `0 m D+` $\rightarrow$ Valid (`0.1 km` Road Equivalent, `+0%` ekstra beban, `ITRA XXS`).
   - Tepat di bawah batas: `0.09 km` dan `-0.1 m D+` $\rightarrow$ Ditolak (`status: 'invalid'`) dengan pesan error spesifik per field.
   - Batas atas valid: `500 km` dan `25000 m D+` $\rightarrow$ Valid (`750.0` Base ITRA, `900.0 km` pada Technical, `ITRA XXL`, *Ultra Warning* aktif).
   - Tepat di atas batas: `500.1 km` dan `25000.1 m D+` $\rightarrow$ Ditolak (`status: 'invalid'`).
2. **Boundary Values Flat Road Pace:**
   - Batas tercepat valid: `02:30 /km` (`150` detik) $\rightarrow$ Valid.
   - Tepat di bawah batas tercepat: `02:29 /km` (`149` detik) $\rightarrow$ `paceStatus: 'invalid'` (namun hasil utama *Km-Effort* tetap tampil dan tidak hilang).
   - Batas terlambat valid: `20:00 /km` (`1200` detik) $\rightarrow$ Valid.
   - Tepat di atas batas terlambat: `20:01 /km` (`1201` detik) $\rightarrow$ `paceStatus: 'invalid'`.
   - Detik `>= 60` (misal `05:60` atau `06:75`) atau desimal pada menit/detik (`6.5`) $\rightarrow$ `paceStatus: 'invalid'` dengan pesan korektif detik `00–59`.
   - Input parsial: Menit diisi (`6`) dan detik dikosongkan (`""`) $\rightarrow$ Dianggap `06:00 /km` (Valid). Menit dikosongkan (`""`) dan detik diisi (`30`) $\rightarrow$ `paceStatus: 'invalid'`.
3. **Presisi Floating Point (IEEE-754):**
   - Skenario `0.1 km` + `D+ 20 m` (`0.2 km` effort): Di JavaScript murni `0.1 + 0.2 = 0.30000000000000004`. Fungsi `roundToOneDecimal` (`src/domain/calculator.ts:23-25`) menghasilkan `0.3` secara bersih tanpa artefak desimal panjang.
4. **Batas Seluruh Kategori ITRA (`XXS` s/d `XXL`):**
   - Diuji pada titik batas `19.9` (`XXS`), `20.0` (`XS`), `34.9` (`XS`), `35.0` (`S`), `64.9` (`S`), `65.0` (`M`), `99.9` (`M`), `100.0` (`L`), `139.9` (`L`), `140.0` (`XL`), `189.9` (`XL`), dan `190.0` (`XXL`).
5. **String Non-Numerik, Koma Desimal, & Unicode:**
   - Input `<script>alert(1)</script>`, emoji `🏃‍♂️⛰️`, `Infinity`, `-Infinity`, dan `"21,5"` ditangani secara aman menjadi state `invalid` tanpa melempar *unhandled exception*.

---

## 5. Daftar Temuan (Findings Log)

Tidak ada temuan *Critical*, *High*, maupun *Medium*. Berikut adalah temuan *Low* dan *Info* untuk penyempurnaan berkelanjutan:

### [LOW-01] Input Desimal dengan Koma (`"21,5"`) Belum Dinormalisasi Secara Eksplisit di Domain
- **Severity:** Low
- **Lokasi:** `src/domain/calculator.ts:230`
- **Deskripsi:** Fungsi `evaluateCalculatorInput` memanggil `Number(distTrimmed)` secara langsung. Jika string mengandung koma sebagai pemisah desimal (misal `"21,5"` dari hasil *paste* teks berbahasa Indonesia), `Number("21,5")` menghasilkan `NaN` dan menampilkan pesan error validasi.
- **Langkah Reproduksi Minimal:** Panggil `evaluateCalculatorInput({ distanceKm: '21,5', elevationGainM: '1000', terrainId: 'runable', paceMinutes: '', paceSeconds: '' })`.
- **Dampak:** Sangat rendah pada browser modern karena elemen `<input type="number" inputMode="decimal">` di HTML secara native menormalisasi atau membatasi input ke format titik, serta pesan error sudah memberi tahu contoh `21.5`.
- **Rekomendasi Perbaikan:** Pada iterasi berikutnya, `lead-engineer` dapat menambahkan normalisasi `.replace(',', '.')` pada `distTrimmed` sebelum diparse ke `Number()`.
- **Status:** Open (Accepted for MVP / Non-blocking)

### [LOW-02] Penambahan HTTP Security Headers & CSP pada Layer Web Server Produksi
- **Severity:** Low
- **Lokasi:** `index.html:1-23` / Konfigurasi Deployment Container
- **Deskripsi:** Aplikasi memuat Google Fonts (`https://fonts.googleapis.com` dan `https://fonts.gstatic.com`) di `index.html`, namun belum memiliki definisi *Content-Security-Policy* (CSP) atau security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`).
- **Langkah Reproduksi Minimal:** Periksa `index.html` atau header respons HTTP pada server statis default.
- **Dampak:** Tanpa header `X-Frame-Options` / CSP `frame-ancestors`, halaman berisiko di-*embed* dalam `<iframe>` pihak ketiga (*clickjacking*), meskipun aplikasi tidak memiliki state autentikasi sensitif.
- **Rekomendasi Perbaikan:** Saat `devops-specialist` menyiapkan konfigurasi Nginx/Caddy di tahap berikutnya, tambahkan header keamanan standar (`X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, dan `Content-Security-Policy` yang mengizinkan `'self'` serta domain Google Fonts).
- **Status:** Open (Handoff ke `devops-specialist`)

### [INFO-01] Penyederhanaan Fallback Clipboard Tanpa `document.execCommand('copy')`
- **Severity:** Info
- **Lokasi:** `src/components/ResultDashboard.tsx:33-48`
- **Deskripsi:** Dokumen desain `docs/design/flows.md:132` menyebutkan eksekusi `document.execCommand('copy')` sebelum menampilkan kotak teks manual ketika `navigator.clipboard.writeText` gagal. Implementasi di `ResultDashboard.tsx` langsung menampilkan `<textarea readOnly>` yang di-*focus* dan di-*select* otomatis.
- **Dampak:** Positif secara teknis karena `document.execCommand('copy')` sudah *deprecated* dari standar web dan sering ikut diblokir pada WebView yang menolak Clipboard API. Pengalaman pengguna tetap terjaga dengan baik.
- **Rekomendasi Perbaikan:** Tidak diperlukan perubahan kode; perilaku saat ini sudah bersih dan teruji.
- **Status:** Closed / Verified

### [INFO-02] Nilai Pre-populated Default Menggunakan Skenario Tahura 21K (`21 km`, `D+ 1000m`, `Moderate`)
- **Severity:** Info
- **Lokasi:** `src/domain/constants.ts:138-144`
- **Deskripsi:** `DEFAULT_CALCULATOR_INPUT` diisi dengan `distanceKm: '21'`, `elevationGainM: '1000'`, `terrainId: 'moderate'`, `paceMinutes: '6'`, `paceSeconds: '00'` sehingga saat halaman pertama kali dibuka, pill preset **"Tahura / 21K Half Trail"** langsung menyala aktif dan mendemonstrasikan baik Base ITRA (`31.0 Km-Effort`) maupun Terrain Penalty (`+3.1 km` $\rightarrow$ `34.1 km`).
- **Dampak:** Sangat baik untuk mendukung Hipotesis 2 PRD (*Advanced Input Engagement*) sejak detik pertama halaman dimuat.
- **Rekomendasi Perbaikan:** Tidak ada.
- **Status:** Closed / Verified

---

## 6. Hasil Nyata Eksekusi Tooling & Automated Tests

Seluruh perintah dijalankan secara nyata di direktori kerja `/home/muktadira22/project/personal/effort-run-calculator`:

### 6.1 Typecheck (`rtk npm run typecheck`)
```text
> tsc --noEmit
(Exit code: 0 — 0 errors)
```

### 6.2 Linter (`rtk npm run lint`)
```text
> eslint .
(Exit code: 0 — 0 warnings, 0 errors)
```

### 6.3 Automated Unit & Integration Tests (`rtk npm test`)
```text
> vitest run
 RUN  v5.0.5 /home/muktadira22/project/personal/effort-run-calculator
 ✓ src/domain/__tests__/calculator.test.ts (18 tests) 9ms
 ✓ src/components/__tests__/App.test.tsx (9 tests) 427ms

 Test Files  2 passed (2)
      Tests  27 passed (27)
   Duration  986ms
```

### 6.4 Production Build (`rtk npm run build`)
```text
> tsc -b && vite build
vite v6.4.4 building for production...
✓ 34 modules transformed.
dist/index.html                   1.18 kB │ gzip:  0.66 kB
dist/assets/index-DvWwOMXL.css   39.44 kB │ gzip:  7.28 kB
dist/assets/index-BpSiZXb7.js   185.05 kB │ gzip: 56.57 kB
✓ built in 667ms
```

### 6.5 Dependency Security Audit (`rtk npm audit`)
```text
found 0 vulnerabilities
(Exit code: 0)
```

---

## Handoff

- **Status Keputusan Rilis:** **GO**
- **Artefak yang Dihasilkan / Diperbarui:**
  - Laporan Audit QA & Security: `docs/qa/review-2026-10-19-mvp.md`
  - Penambahan Unit Tests (18 total): `src/domain/__tests__/calculator.test.ts`
  - Penambahan Integration & Sad-Path UI Tests (9 total): `src/components/__tests__/App.test.tsx`
- **Rekomendasi untuk Tahap Selanjutnya (`devops-specialist`):**
  1. Gunakan artefak statis hasil `npm run build` (`dist/`) beserta endpoint `public/health.json` (`/health.json`) untuk *container healthcheck*.
  2. Terapkan HTTP Security Headers pada konfigurasi server statis (Nginx/Caddy) sesuai rekomendasi `LOW-02` (`X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, dan `Content-Security-Policy`).
