# Low-Fidelity Wireframe & Microcopy: Halaman Utama Kalkulator (`calculator-main`)

**Dokumen:** `docs/design/screens/calculator-main.md`  
**Tanggal:** 19 Oktober 2026  
**Penulis:** The Experience Crafter (Lead UI/UX Designer)  
**Referensi PRD:** `docs/product/prd-trail-effort-converter.md`  
**Status:** Ready for Engineering Handoff

---

## 1. Struktur Layout & Low-Fidelity Wireframe

### 1.1 Desktop Wireframe (`>= 768px` — 12-Column Asymmetric Split)

Fokus utama: Pengguna dapat mengubah parameter rute di kolom kiri (5 kolom) dan langsung melihat perubahan hasil di kolom kanan (7 kolom) tanpa *scrolling*.

```text
+--------------------------------------------------------------------------------------------------+
| [M] TRAIL EFFORT CONVERTER                     [Badge: Standar ITRA Km-Effort]   [Cara Hitung ↓] |
|     Ubah spesifikasi rute trail (Jarak & Elevasi D+) menjadi ekuivalen jarak & waktu di aspal.   |
+--------------------------------------------------------------------------------------------------+
| COBA PRESET CEPAT (1-KLIK):                                                                      |
| ( 10K Short Trail • D+ 400m )  ( *Tahura / 21K Half • D+ 1.000m* )  ( Siksorogo / 15K • D+ 1.200m ) |
| ( 50K Ultra Mountain • D+ 3.000m )                                                               |
+----------------------------------------------+---------------------------------------------------+
| PANEL INPUT RUTE TRAIL          [Reset]      | HASIL EKUIVALEN JALAN RAYA (ROAD EQUIVALENT)      |
|                                              |                                                   |
| 1. SPESIFIKASI RUTE (WAJIB)                  | +-----------------------------------------------+ |
| +--------------------+ +-------------------+ | | EKUIVALEN JARAK ASPAL DATAR                   | |
| | Jarak Trail        | | Total Tanjakan D+ | | |                                               | |
| | [ 21.0        |km] | | [ 1000        |m] | | |   34.1 km                 [ITRA XS: 20-34]    | |
| +--------------------+ +-------------------+ | |   Setara ~1.6x Half Marathon di jalan raya    | |
| Bantu: Sesuai poster   Bantu: Total kumulatif| |                                               | |
| lomba / GPX            naik (Elevation Gain) | |   Rincian Pembentuk Beban:                    | |
|                                              | |   • Jarak Asli Trail   : 21.0 km              | |
| 2. KARAKTERISTIK MEDAN (TERRAIN MODIFIER)    | |   • Beban Tanjakan D+  : +10.0 km (ITRA 31.0) | |
| +------------------------------------------+ | |   • Faktor Medan (+10%): +3.1 km              | |
| | ( ) Runable / Fire Road           [+0%]  | | |   • Total Ekstra Beban : +62% vs jarak datar  | |
| |     Tanah padat, jalur lebar, lari mulus | | +-----------------------------------------------+ |
| +------------------------------------------+ |                                                   |
| | (*) Moderate Singletrack         [+10%]  | | +-----------------------------------------------+ |
| |     Jalur setapak, akar pohon & batu     | | | ESTIMASI WAKTU & EFFECTIVE TRAIL PACE         | |
| +------------------------------------------+ | | (Berdasarkan Flat Road Pace 06:00 /km)        | |
| | ( ) Technical / Rocky / Muddy    [+20%]  | | |                                               | |
| |     Batu lepas, lumpur, curam ekstrem    | | |   Estimasi Waktu Selesai   Effective Pace     | |
| +------------------------------------------+ | |   3 jam 25 menit           09:45 /km          | |
|                                              | |   (205 menit total)        (+03:45/km vs road)| |
| 3. KEMAMPUAN LARI DATAR (OPSIONAL)           | +-----------------------------------------------+ |
| Pace Jalan Raya (Flat Road Pace)             |                                                   |
| +---------------+ +---------------+          | +-----------------------------------------------+ |
| | [ 06     |mnt]| | [ 00     |dtk]|  / km    | | [!] PERHATIAN JARAK ULTRA (>50 Km-Effort)     | |
| +---------------+ +---------------+          | | (Hanya tampil jika hasil >= 50 Km-Effort)     | |
| Bantu: Pace nyaman Anda saat long run di     | +-----------------------------------------------+ |
| jalan raya datar untuk estimasi waktu trail. |                                                   |
|                                              | [ 📋 Salin Ringkasan ke WhatsApp / Strava       ] |
+----------------------------------------------+---------------------------------------------------+
| BAGAIMANA ANGKA INI DIHITUNG? (TRANSPARANSI METODOLOGI)                                          |
| +------------------------------+ +------------------------------+ +----------------------------+ |
| | 1. Standar ITRA Km-Effort    | | 2. Penalti Medan Teknis      | | 3. Konversi Waktu & Pace   | |
| |Setiap 100m tanjakan (D+)     | |Rumus ITRA murni mengabaikan  | |Waktu tempuh dihitung dari  | |
| |setara tambahan +1 km jarak   | |permukaan jalur. Kami tambah  | |Adjusted Road Equivalent x  | |
| |datar: Km-Effort = Jarak +    | |faktor +0% (Runable), +10%    | |Flat Road Pace Anda, lalu   | |
| |(D+ / 100).                   | |(Moderate), dan +20% (Teknis).| |dibagi jarak aktual trail.  | |
| +------------------------------+ +------------------------------+ +----------------------------+ |
+--------------------------------------------------------------------------------------------------+
```

---

### 1.2 Mobile Wireframe (`< 768px` — Single-Column Vertical Stack)

Pada layar ponsel, jarak vertikal dioptimalkan agar pengguna cukup melakukan 1 guliran pendek dari input ke kartu hasil utama:

```text
+----------------------------------------+
| [M] TRAIL EFFORT CONVERTER             |
| Konversi beban lari trail ke aspal     |
+----------------------------------------+
| PRESET RUTE POPULER (Geser/Pilih):     |
| [10K Short (D+ 400m)] [Tahura 21K]     |
| [Siksorogo 15K]       [50K Ultra]      |
+----------------------------------------+
| INPUT RUTE TRAIL               [Reset] |
|                                        |
| Jarak Trail (km)    Tanjakan D+ (m)    |
| [ 21.0       |km]   [ 1000       |m]   |
|                                        |
| Karakteristik Medan:                   |
| ( ) Runable / Fire Road         [+0%]  |
| (*) Moderate Singletrack       [+10%]  |
| ( ) Technical / Rocky          [+20%]  |
|                                        |
| Flat Road Pace Anda (Opsional):        |
| [ 06 |mnt] : [ 00 |dtk]  per km        |
+----------------------------------------+
| HASIL EKUIVALEN JALAN RAYA             |
| +------------------------------------+ |
| | EKUIVALEN JARAK ASPAL DATAR        | |
| | 34.1 km            [ITRA XS]       | |
| | Setara ~1.6x Half Marathon Road    | |
| | ---------------------------------- | |
| | Base ITRA: 31.0 km (+10.0 km D+)   | |
| | Medan (+10%): +3.1 km (+62% beban) | |
| +------------------------------------+ |
| | ESTIMASI WAKTU & PACE TRAIL        | |
| | Waktu Selesai : 3 jam 25 menit     | |
| | Effective Pace: 09:45 /km          | |
| +------------------------------------+ |
| [ 📋 Salin Ringkasan ke WhatsApp     ] |
+----------------------------------------+
| ▼ Bagaimana Angka Ini Dihitung?        |
+----------------------------------------+
```

---

## 2. Panduan Microcopy & Tone of Voice

### 2.1 Prinsip Tone of Voice
- **Rekan Lari yang Berpengalaman (*Seasoned Trail Buddy*):** Menggunakan istilah yang akrab di telinga pelari Indonesia (*Elevation Gain D+*, *Long Run*, *Flat Road Pace*, *Singletrack*, *Water Station*, *Cut-Off Time*), namun selalu menyertakan penjelasan singkat bagi pelari *road* pemula.
- **Lugas & Jujur Secara Ilmiah:** Membedakan dengan tegas mana angka resmi **Base ITRA Km-Effort** dan mana angka **Adjusted Road Equivalent** (yang sudah dikali faktor medan).
- **Berorientasi Tindakan:** Semua tombol menggunakan kata kerja aktif. Semua pesan error menjelaskan **apa yang salah** dan **langkah spesifik memperbaikinya**.

---

### 2.2 Spesifikasi Microcopy per Komponen

#### A. Header & Quick Presets
| Elemen | Teks / Copy Eksak | Catatan UX |
| :--- | :--- | :--- |
| **Judul Aplikasi** | `Trail-to-Road Effort Converter` | Sub-brand: `Kalkulator Km-Effort & Estimasi Waktu Trail` |
| **Deskripsi Header** | `Ukur seberapa berat rute trail pilihanmu jika disetarakan dengan lari di jalan raya datar (aspal), lengkap dengan perkiraan waktu tempuh dari pace road kamu.` | Menjawab langsung *value proposition* dalam 1 kalimat. |
| **Label Bar Preset** | `Coba Preset Rute & Lomba Populer:` | Mengajak eksplorasi 1-klik. |
| **Chip Preset 1** | `10K Short Trail (D+ 400m)` | Mengisi: `10 km`, `400 m`, `Moderate (+10%)` |
| **Chip Preset 2** | `Tahura / 21K Half Trail (D+ 1.000m)` | Mengisi: `21 km`, `1000 m`, `Moderate (+10%)` |
| **Chip Preset 3** | `Siksorogo / 15K Steep (D+ 1.200m)` | Mengisi: `15 km`, `1200 m`, `Technical (+20%)` |
| **Chip Preset 4** | `50K Ultra Mountain (D+ 3.000m)` | Mengisi: `50 km`, `3000 m`, `Technical (+20%)` |

#### B. Form Input & Helper Text
| Field | Label Utama | Placeholder | Suffix Unit | Helper Text (Default) |
| :--- | :--- | :--- | :--- | :--- |
| **Jarak Trail** | `Jarak Rute Trail` | `Misal: 21` | `km` | `Jarak horizontal sesuai info lomba/rute.` |
| **Elevasi D+** | `Total Tanjakan (D+)` | `Misal: 1000` | `m D+` | `Kumulatif naik (100m D+ = +1 km datar).` |
| **Medan 1** | `Runable / Fire Road` | — | `+0% Effort` | `Tanah padat, jalur lebar, minim hambatan teknis (Standar ITRA murni).` |
| **Medan 2** | `Moderate Singletrack` | — | `+10% Effort` | `Jalur setapak hutan, akar pohon, tanah gembur, dan bebatuan sedang.` |
| **Medan 3** | `Technical / Rocky / Muddy` | — | `+20% Effort` | `Batu lepas, lumpur licin, tanjakan/turunan curam yang memaksa jalan kaki.` |
| **Road Pace** | `Flat Road Pace Anda (Opsional)` | `06` : `00` | `/ km` | `Masukkan pace rata-rata Anda saat lari jarak menengah/jauh di jalan raya datar.` |

#### C. Pesan Validasi & Error (Apa yang Salah + Cara Memperbaiki)
| Skenario Error | Pesan Error Eksak |
| :--- | :--- |
| **Jarak kosong / `<= 0`** | `Jarak rute belum valid. Masukkan angka jarak lebih dari 0 km (contoh: 15 atau 21.5).` |
| **Jarak `> 500 km`** | `Jarak melebihi batas kalkulator (maksimal 500 km). Kurangi angka jarak untuk melihat hasil.` |
| **Elevasi D+ `< 0`** | `Total tanjakan (D+) tidak boleh bernilai negatif. Masukkan angka 0 atau lebih (contoh: 800).` |
| **Elevasi D+ `> 25.000 m`** | `Total tanjakan melebihi batas wajar satu lomba (maksimal 25.000 m). Periksa kembali satuan meter Anda.` |
| **Detik Pace `>= 60` atau `< 0`** | `Format detik tidak valid. Masukkan angka detik antara 00 hingga 59.` |
| **Pace terlalu cepat/lambat (`< 02:30` atau `> 20:00 /km`)** | `Pace berada di luar rentang lari wajar. Masukkan pace jalan raya antara 02:30/km hingga 20:00/km.` |

#### D. Kartu Hasil & Callout Peringatan
| Elemen Hasil | Template Microcopy |
| :--- | :--- |
| **Label Hero Metric** | `EKUIVALEN JARAK JALAN RAYA (ADJUSTED ROAD EFFORT)` |
| **Sub-judul Benchmark** | `Beban fisik rute ini setara lari ~{multiplier}x {nama_lomba_road} di aspal datar.` *(Contoh: `Setara lari ~1.6x Half Marathon (21.1K) di aspal datar`)* |
| **Badge Ekstra Beban** | `+{extra_pct}% ekstra beban dibanding angka jarak aslinya` |
| **Perbandingan Transparan ITRA** | `Standar Murni ITRA: {base_itra} Km-Effort ({distance} km jarak + {elev_km} km dari elevasi) • Koreksi Medan: +{terrain_km} km` |
| **Empty State Pace Card** | `Ingin tahu perkiraan waktu finis? Isi kolom Flat Road Pace di samping untuk menghitung estimasi waktu tempuh dan Effective Trail Pace Anda.` |
| **Ultra Distance Warning (`>= 50 Km-Effort`)** | **Perhatian Jarak Ultra (Fatigue Decay):** `Beban rute ini mencapai {adjusted_km} Km-Effort. Di atas 50 Km-Effort, kelelahan otot quadriceps pada turunan dan jeda nutrisi di Water Station membuat perlambatan bersifat non-linear. Siapkan cadangan waktu ekstra 15%–25% dari estimasi di atas.` |

#### E. Template Teks "Salin Ringkasan" (WhatsApp / Strava Format)
Saat pengguna menekan tombol **"Salin Ringkasan ke WhatsApp / Strava"**, format teks yang disalin ke *clipboard* menggunakan penanda tebal WhatsApp (`*teks*`) agar langsung rapi ketika ditempel ke grup komunitas lari:

```text
🏔️ *RINGKASAN BEBAN LARI TRAIL (KM-EFFORT)*
• Rute Trail: *{distance} km* | Tanjakan: *D+ {elevation} m*
• Kondisi Medan: *{terrain_label} (+{terrain_pct}%)*

🛣️ *Ekuivalen Jalan Raya (Road Equivalent):*
👉 *{adjusted_km} km* di aspal datar *(+{extra_pct}% ekstra beban)*
• Standar Murni ITRA: {base_itra} Km-Effort ({itra_category})
• Pembanding: {road_benchmark_text}

⏱️ *Estimasi Waktu & Pace (Road Pace {road_pace}/km):*
• Perkiraan Waktu Tempuh: *{formatted_duration}*
• Effective Trail Pace: *{effective_trail_pace}/km*

Dihitung via Trail-to-Road Effort Converter
```
*(Catatan: Jika pengguna tidak mengisi Flat Road Pace, blok `⏱️ Estimasi Waktu & Pace` otomatis diganti dengan satu baris: `⏱️ Estimasi Waktu: (Isi Flat Road Pace untuk melihat target waktu)`).*
