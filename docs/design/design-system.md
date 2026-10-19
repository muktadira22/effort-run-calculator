# Design System: Trail-to-Road Effort Converter

**Dokumen:** `docs/design/design-system.md`  
**Tanggal:** 19 Oktober 2026  
**Penulis:** The Experience Crafter (Lead UI/UX Designer)  
**Referensi PRD:** `docs/product/prd-trail-effort-converter.md`  
**Status:** Ready for Engineering Handoff

---

## 1. Filosofi Visual: *"Alpine Trail Meets Asphalt Road"*

Desain visual menggabungkan dua dunia yang dijembatani oleh produk ini:
1. **Dunia Trail (*Alpine Forest & Terracotta Earth*):** Hijau pinus pegunungan yang tegas (`#14532D` / `#166534`) dan aksen tanah/batu terakota (`#C2410C`) merepresentasikan jalur pendakian, hutan, dan kontur topografi.
2. **Dunia Road (*Asphalt Slate & Crisp White*):** Abu-abu aspal gelap (`#0F172A` / `#1E293B`) dengan tipografi numerik yang tajam seperti marka jalan raya dan layar jam tangan GPS olahraga (Garmin/Coros).
3. **Keterbacaan di Luar Ruangan (*High-Contrast Daylight Readability*):** Pelari sering membuka kalkulator ini di ponsel saat berada di luar ruangan (area parkir *trailhead* atau kafe setelah *morning run*). Oleh karena itu, seluruh teks utama dan angka metrik memenuhi standar kontras **WCAG AAA (>7:1)** dan seluruh elemen sekunder memenuhi **WCAG AA (>=4.5:1)**.

---

## 2. Design Tokens

### 2.1 Palet Warna & Rasio Kontras (WCAG 2.1)

#### A. Warna Primer (Brand / Trail Forest) & Aksen (Trail Marker)
| Token Name | Tailwind Equivalent | Hex | Peruntukan UI | Kontras vs Putih (`#FFFFFF`) |
| :--- | :--- | :--- | :--- | :--- |
| `--color-primary-900` | `emerald-950` / `green-900` | `#14532D` | Latar kartu Hero Result, teks aksen gelap | **9.4 : 1** (AAA) |
| `--color-primary-700` | `green-700` | `#15803D` | Tombol utama (Default), border radio aktif, ikon utama | **5.1 : 1** (AA) |
| `--color-primary-800` | `green-800` | `#166534` | Tombol utama (Hover/Active), teks badge primer | **7.1 : 1** (AAA) |
| `--color-primary-50` | `green-50` | `#F0FDF4` | Latar radio card yang sedang dipilih (*selected state*), *chip* aktif | — (Surface) |
| `--color-accent-600` | `orange-700` | `#C2410C` | Aksen kontur tanjakan (`D+`), penanda ekstra beban | **5.2 : 1** (AA) |
| `--color-accent-50` | `orange-50` | `#FFF7ED` | Latar badge ekstra beban (`+50% effort`) | — (Surface) |

#### B. Warna Netral (Asphalt Slate & Limestone Surface)
| Token Name | Tailwind Equivalent | Hex | Peruntukan UI | Kontras vs Background |
| :--- | :--- | :--- | :--- | :--- |
| `--color-bg-canvas` | `stone-100` / `#F5F5F0` | `#F5F5F0` | Latar belakang halaman (*Warm Limestone* — tidak menyilaukan mata) | — |
| `--color-bg-surface` | `white` | `#FFFFFF` | Latar kartu input, kartu metodologi, dan field input | — |
| `--color-bg-asphalt` | `slate-900` | `#0F172A` | Latar kartu Hero Result Ekuivalen Road (*Asphalt Dark Card*) | **17.8 : 1** vs Putih (AAA) |
| `--color-text-primary` | `slate-900` | `#0F172A` | Judul, angka input, label utama | **16.1 : 1** vs Canvas (AAA) |
| `--color-text-secondary`| `slate-600` | `#475569` | Sub-judul, penjelasan medan, satuan input (`km`, `m`) | **7.0 : 1** vs Surface (AAA) |
| `--color-text-muted` | `slate-500` | `#64748B` | Helper text, placeholder (dikombinasikan dengan label eksplisit) | **4.6 : 1** vs Surface (AA) |
| `--color-border-default`| `stone-300` / `slate-300`| `#CBD5E1` | Border input default, pembatas kartu | — |
| `--color-border-strong` | `slate-400` | `#94A3B8` | Border input saat *hover* | — |

#### C. Warna Semantik (Status & Feedback)
| Semantik | Token Latar | Token Border | Token Teks / Ikon | Kontras Teks vs Latar | Penggunaan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Success** | `#ECFDF5` (`emerald-50`) | `#6EE7B7` (`emerald-300`) | `#065F46` (`emerald-800`) | **7.3 : 1** (AAA) | Feedback tombol `"✓ Tersalin ke Clipboard!"` |
| **Warning** | `#FFFBEB` (`amber-50`) | `#FCD34D` (`amber-300`) | `#92400E` (`amber-800`) | **6.8 : 1** (AA+) | Callout **Peringatan Jarak Ultra (>50 Km-Effort)** |
| **Danger / Error**| `#FEF2F2` (`red-50`) | `#FCA5A5` (`red-300`) | `#B91C1C` (`red-700`) | **5.9 : 1** (AA) | Pesan error validasi input Jarak, Elevasi, & Pace |
| **Info / ITRA** | `#EFF6FF` (`blue-50`) | `#93C5FD` (`blue-300`) | `#1E40AF` (`blue-800`) | **8.1 : 1** (AAA) | Badge kategori resmi **ITRA (XXS s/d XXL)** |

---

### 2.2 Tipografi & Hierarki Metrik

Menggunakan kombinasi font sistem modern dan Google Fonts yang ringan:
- **Font Sans (UI & Copy):** `'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif` — karakter humanis, modern, dan sangat terbaca pada ukuran kecil.
- **Font Mono / Tabular (Angka Metrik, Pace, & Input):** `'JetBrains Mono', 'Plus Jakarta Sans', monospace` dengan properti wajib `font-variant-numeric: tabular-nums` pada seluruh angka hasil dan input agar lebar digit identik dan tidak terjadi *layout jitter* saat angka berubah secara reaktif.

#### Skala Tipografi
| Token | Ukuran (`rem` / `px`) | Line Height | Weight | Tracking | Penggunaan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display-hero` | `3.25rem` (`52px`) mobile `2.5rem` (`40px`) | `1.05` | `800` (ExtraBold) | `-0.03em` | Angka utama **Adjusted Road Equivalent (km)** |
| `metric-lg` | `1.75rem` (`28px`) | `1.2` | `700` (Bold) | `-0.02em` | Angka **Estimasi Waktu Tempuh** & **Effective Trail Pace** |
| `heading-lg` | `1.5rem` (`24px`) | `1.3` | `700` (Bold) | `-0.015em`| Judul utama halaman (H1) |
| `heading-md` | `1.125rem` (`18px`) | `1.4` | `700` (Bold) | `-0.01em` | Judul panel/kartu (H2) |
| `input-value` | `1.125rem` (`18px`) | `1.5` | `600` (SemiBold) | `0` | Teks di dalam input Jarak, Elevasi, dan Pace (mencegah *auto-zoom* di iOS Safari karena `>= 16px`) |
| `body-md` | `0.9375rem` (`15px`) | `1.5` | `400` / `500` | `0` | Deskripsi umum, rincian beban |
| `body-sm` | `0.8125rem` (`13px`) | `1.45` | `500` (Medium) | `0` | Helper text, pesan error, deskripsi kondisi medan |
| `label-caps` | `0.75rem` (`12px`) | `1.3` | `700` (Bold) | `+0.06em` | Eyebrow label (`UPPERCASE`), badge kategori ITRA |

---

### 2.3 Skala Spacing (Grid 4px / 8px), Radius, Elevasi & Breakpoint

- **Skala Spacing:**
  - `space-1`: `4px` (`0.25rem`) — Jarak antara label dan helper text.
  - `space-2`: `8px` (`0.5rem`) — Gap antar *preset chips*, padding internal badge.
  - `space-3`: `12px` (`0.75rem`) — Padding vertikal input, jarak antar radio card medan.
  - `space-4`: `16px` (`1rem`) — Padding kartu mobile, gap antar kolom input Jarak & D+.
  - `space-6`: `24px` (`1.5rem`) — Padding kartu desktop, jarak antar seksi di dalam panel.
  - `space-8`: `32px` (`2rem`) — Jarak antar kolom utama (Input vs Result) dan antar zona vertikal.
- **Border Radius:**
  - `radius-sm`: `6px` (`rounded-md`) — Badge kategori ITRA.
  - `radius-md`: `10px` (`rounded-lg`) — Input field, tombol utama, kartu radio medan.
  - `radius-lg`: `16px` (`rounded-2xl`) — Panel utama (Input Card & Result Hero Card).
  - `radius-full`: `9999px` (`rounded-full`) — Tombol *Quick Preset Pills*.
- **Elevasi (Shadows):**
  - `shadow-card`: `0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.06)` (dikombinasikan dengan border `1px solid #E2E8F0`).
  - `shadow-hero`: `0 10px 25px -5px rgba(15, 23, 42, 0.18), 0 8px 10px -6px rgba(15, 23, 42, 0.1)` (untuk kartu *Result Dashboard* berwarna gelap aspal).
- **Breakpoints:**
  - `sm`: `640px` (Tablet kecil / Phablet)
  - `md`: `768px` (Batas transisi dari *1-column mobile stack* ke *12-column desktop split*)
  - `lg`: `1024px` (Container maksimal dibatasi pada `max-w-5xl` / `1024px` agar mata pengguna tidak perlu melompat terlalu jauh antara input dan output).

---

## 3. Spesifikasi Komponen Inti & Seluruh State-nya

### 3.1 Numeric Input with Unit Suffix (`Jarak`, `Elevasi D+`, `Pace`)
Dirancang dengan tinggi minimal `48px` (*touch target* ramah jempol di layar ponsel) dan *font-size* `18px` (`1.125rem`) agar iOS Safari tidak melakukan *forced zoom* saat pengguna mengetuk input.

| State | Visual & CSS Token | Perilaku & Aksesibilitas |
| :--- | :--- | :--- |
| **Default** | `bg-white border border-slate-300 text-slate-900 rounded-lg` dengan suffix unit (`km`, `m D+`) di sisi kanan berwarna `text-slate-500 bg-slate-50`. | `inputmode="decimal"` untuk Jarak, `inputmode="numeric"` untuk Elevasi & Pace agar memunculkan *numpad* di ponsel. |
| **Hover** | `border-slate-400` | Kursor berubah menjadi `text`. |
| **Focus** | `border-green-700 ring-3 ring-green-700/20 outline-none` | Memilih (*select*) teks angka atau siap diketik langsung dengan transisi `150ms`. |
| **Active / Typing**| Angka berubah secara reaktif tanpa jeda (*instant reactive calculation*). | Menggunakan `tabular-nums`. |
| **Disabled** | `bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed` | Digunakan hanya jika fitur dikunci (tidak aktif pada alur standar). |
| **Error / Invalid**| `bg-red-50/40 border-red-600 ring-2 ring-red-600/15 text-red-900` | `aria-invalid="true"`, `aria-describedby` mengarah ke ID pesan error berwarna `text-red-700` di bawah input. |

---

### 3.2 Terrain Technicality Selector (Segmented Radio Cards)
Menggunakan pola *Custom Radio Group* (`role="radiogroup"`) di mana setiap pilihan menampilkan: **Nama Medan**, **Badge Persentase Tambahan (`+0%`, `+10%`, `+20%`)**, dan **1 baris deskripsi permukaan fisik**.

| State | Visual & CSS Token |
| :--- | :--- |
| **Default (Unselected)** | `bg-white border border-slate-200 hover:border-slate-300 text-slate-800` • Lingkaran radio kosong `border-slate-300`. |
| **Hover (Unselected)** | `bg-stone-50/80 border-slate-300` |
| **Selected / Active** | `bg-green-50/70 border-2 border-green-700 shadow-xs` • Lingkaran radio terisi penuh `bg-green-700` dengan titik putih di tengah; badge persentase berubah menjadi `bg-green-800 text-white`. |
| **Focus-Visible (Keyboard)** | `ring-3 ring-green-700/30 outline-none` (Navigasi menggunakan tombol panah Atas/Bawah atau Kiri/Kanan). |
| **Disabled** | `opacity-50 pointer-events-none bg-slate-50` |

---

### 3.3 Quick Preset Pills (Skenario & Lomba Ikonik Indonesia)
Tombol *chip* di bagian atas halaman yang mengisi `Jarak`, `Elevasi D+`, dan `Medan` dalam 1 klik.

| State | Visual & CSS Token |
| :--- | :--- |
| **Default (Inactive)** | `bg-white border border-slate-300 text-slate-700 hover:bg-stone-50 hover:border-slate-400 rounded-full px-3.5 py-2 text-xs font-semibold` |
| **Active (Matched)** | Jika nilai input saat ini persis sama dengan nilai Preset, chip tersebut menyala: `bg-green-800 border-green-800 text-white shadow-xs` dengan indikator titik hijau terang. Jika pengguna mengubah angka manual, status aktif pada chip otomatis lepas. |
| **Focus-Visible** | `ring-3 ring-green-700/30 outline-none` |

---

### 3.4 Tombol Aksi Utama: "Salin Ringkasan" (`CopySummaryButton`)
Berada di bagian bawah *Result Dashboard* dengan tinggi minimal `48px` (`py-3.5 px-5`).

| State | Visual & CSS Token | Label & Ikon |
| :--- | :--- | :--- |
| **Default** | `bg-green-700 text-white font-semibold rounded-xl shadow-sm` | Ikon Clipboard + `"Salin Ringkasan ke WhatsApp / Strava"` |
| **Hover** | `bg-green-800 shadow-md -translate-y-0.5 transition-all` | Sama dengan Default |
| **Active (Pressed)**| `bg-green-900 translate-y-0` | Sama dengan Default |
| **Focus-Visible** | `ring-4 ring-green-500/40 outline-none` | Sama dengan Default |
| **Success (Copied State)** | `bg-emerald-600 text-white ring-4 ring-emerald-500/30` (bertahan `2500ms`) | Ikon Centang (`✓`) + `"Tersalin! Siap ditempel ke grup lari"` |
| **Disabled (Saat Input Invalid/Kosong)** | `bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60` | `"Lengkapi jarak & elevasi untuk menyalin hasil"` |

---

## 4. Standar Aksesibilitas (Inclusivity & A11y Checklist)

1. **Label Eksplisit:** Setiap `<input>` wajib memiliki elemen `<label for="...">` yang terlihat jelas (tidak pernah hanya mengandalkan `placeholder`).
2. **Pengumuman Layar Baca (*Screen Reader Live Region*):** Kartu hasil utama menggunakan atribut `aria-live="polite"` dan `aria-atomic="true"` sehingga perubahan hasil kalkulasi dapat dibacakan tanpa memotong fokus ketikan pengguna.
3. **Indikator Non-Warna:** Status *Error* tidak hanya ditandai warna merah, melainkan disertai ikon tanda seru (`⚠️`) dan teks instruksi perbaikan. Status *Terrain Selected* tidak hanya ditandai warna hijau, melainkan juga ketebalan border (`2px`), ikon radio terisi, dan badge kontras tinggi.
4. **Target Sentuh Mobile:** Seluruh tombol *Quick Preset*, *Terrain Card*, dan tombol *Salin Ringkasan* memiliki dimensi target sentuh minimal `44x44 px` sesuai standar WCAG 2.5.5.
