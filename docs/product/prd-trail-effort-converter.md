# PRD: Trail-to-Road Effort Converter (MVP)

**Dokumen:** `docs/product/prd-trail-effort-converter.md`  
**Tanggal:** 19 Oktober 2026  
**Penulis:** The Strategist (Product & Market Lead)  
**Status:** Ready for Design & Engineering Handoff

---

## 1. Ringkasan & Problem Statement

### Ringkasan Produk
Kalkulator web instan (tanpa login) yang menerjemahkan rencana atau hasil lari *trail* (berdasarkan jarak horizontal dan *elevation gain*, ditambah opsi faktor teknis medan) menjadi ekuivalen jarak lari jalan raya datar (*Flat Road Equivalent Distance* / *Km-Effort*) serta estimasi waktu tempuh bila pengguna memasukkan *flat road pace* mereka.

### Problem Statement
Pelari *road* yang bertransisi ke *trail running*—maupun pelari *trail* rekreasional yang sedang merencanakan balapan (*race*) atau *long run* mingguan—sering salah mengukur beban latihan (*training load*) dan target waktu (*pacing*). 
- **Masalah Nyata:** Lari *trail* sejauh 15 km dengan *elevation gain* (D+) 800m tidak sama dengan lari *road* 15 km. Menganggapnya setara memicu *overtraining*, salah memilih kategori lomba, atau kehabisan energi sebelum *Cut-Off Time* (COT).
- **Friksi Saat Ini:** Pelari harus menghitung manual di kepala/Excel dengan rumus ITRA ($100\text{m } D+ = +1\text{ km}$), atau menunggu *post-run analysis* di Strava (GAP - *Grade Adjusted Pace* yang hanya muncul setelah lari selesai dan sering berbayar untuk analisis mendalam), sementara *tools* seperti ITRA/TrailMath terlalu rumit atau tersembunyi di balik ekosistem lomba.
- **Kesenjangan:** Belum ada alat *pre-run planning* yang instan, ringan, *mobile-first*, dan langsung menjawab pertanyaan sederhana: *"Lari trail X km dengan tanjakan Y meter ini rasanya setara lari road berapa km, dan kira-kira butuh waktu berapa lama dengan pace road saya?"*

### Pre-Mortem (Mengapa Produk Ini Bisa Gagal dalam 6 Bulan?)
1. **Ancaman Mental Math ("Terlalu Sepele"):** Jika kalkulator hanya menampilkan rumus $Jarak + (Elevasi / 100)$, pengguna cukup menghitung di kepala dalam 3 detik dan tidak pernah kembali membuka aplikasi (*zero retention*).
   - *Mitigasi MVP:* Tambahkan konversi dua arah/kontekstual secara instan: (a) Ekuivalen jarak *road* (Km-Effort), (b) Opsi *Terrain Technicality Modifier* (karena 15 km + 800m di jalan berbatu/lumpur teknikal jauh lebih berat daripada *fire road* tanah padat), dan (c) Estimasi waktu selesai (*Estimated Finish Time* & *Effective Trail Pace*) berdasarkan input *flat road pace* pengguna.
2. **Ketidakakuratan Ekspektasi ("Hasilnya Meleset di Lapangan"):** Formula ITRA murni mengabaikan *elevation loss* (turunan curam yang merusak otot *quads* secara eksentrik) dan permukaan teknis.
   - *Mitigasi MVP:* Sediakan perbandingan transparan antara **Standar ITRA (Km-Effort)** dan **Adjusted Trail Effort** (dengan penalti permukaan teknis/turunan sederhana) agar pengguna memahami rentang beban (*effort range*).

---

## 2. Target Pengguna & Persona (Berbasis Perilaku)

| Persona | Perilaku & Konteks Penggunaan | Pain Point Utama | Jobs-to-be-Done (JTBD) |
| :--- | :--- | :--- | :--- |
| **1. "Si Transisi Road-to-Trail" (Primary)** | Pelari *road* rutin (biasa lari 10K/Half Marathon di aspal, hafal *pace* datar misal 5:30/km) yang baru mendaftar *trail race* pertama atau diajak *trail run* akhir pekan. | Bingung membaca poster lomba ("21K dengan D+ 1.200m itu seberat apa? Apakah setara Full Marathon di road?"). | *"Saat melihat spek rute trail (jarak & D+), saya ingin tahu setara berapa km di aspal dan berapa jam waktu yang harus saya siapkan."* |
| **2. "Si Perencana Latihan Mingguan" (Secondary)** | Pelari *hybrid* (*road* di hari kerja, *trail* di akhir pekan) yang memantau volume mingguan (*weekly mileage*) agar tidak cedera. | Jika minggu ini lari *trail* 20K (D+ 1.000m), di aplikasi pencatat hanya tertulis 20 km, padahal beban tubuh setara 30 km *road*. | *"Saat merencanakan atau merangkum long run di bukit, saya ingin mengonversi effort-nya ke ekuivalen kilometer datar untuk menjaga kuota latihan mingguan."* |

---

## 3. Metodologi Perhitungan & Riset Industri

Berdasarkan riset literatur dan standar industri (diakses 19 Oktober 2026):

1. **ITRA Km-Effort Standard (Fakta Industri):**
   - Digunakan secara resmi oleh *International Trail Running Association* (ITRA) untuk mengklasifikasikan tingkat kesulitan lomba (XXS hingga XXL).
   - **Rumus:** $\text{Km-Effort} = \text{Distance (km)} + \frac{\text{Elevation Gain } D+\text{ (m)}}{100}$
   - Setiap kenaikan vertikal 100 meter dihitung setara dengan tambahan 1 km jarak datar.
2. **Naismith's Rule & Scarf's Equivalence (Fakta Akademis):**
   - Prof. Philip Scarf menurunkan ekuivalensi jarak datar $D_{eq} = x + \alpha \cdot y$ dengan $\alpha \approx 7.92 \text{ hingga } 8$ (100m tanjakan $\approx 0.8\text{ km}$ datar) untuk pendakian gunung, yang kemudian dibulatkan oleh komunitas *trail running* Eropa (ITRA) menjadi faktor $10\times$ ($100\text{m} = 1\text{ km}$) untuk mengakomodasi dinamika lari.
3. **Minetti's Energy Cost / Grade Adjusted Pace - GAP (Fakta Fisiologis):**
   - Studi Minetti et al. (2002) mengukur biaya metabolik (J/kg/m) di *treadmill* pada berbagai kemiringan. Kemiringan +10% menggandakan biaya energi dibanding lari datar. Namun, Minetti dihitung di atas *treadmill* mulus dan **tidak memperhitungkan permukaan teknis** (akar, batu, lumpur) yang menurut data empiris menurunkan efisiensi langkah sebesar **10%–15%+**.
4. **Extended Effort / Technical Surface Factor (Opini Praktisi & Asumsi Produk):**
   - Kalkulator modern seperti *TrailMath* menambahkan penalti turunan ($D- / 200$) dan faktor teknis medan. Untuk menjaga kesederhanaan MVP tanpa mewajibkan upload file GPX, penggunaan **faktor pengali permukaan (Surface/Technicality Multiplier)** sebesar **1.0x (Runable / Fire Road)**, **1.1x (Moderate Trail)**, hingga **1.25x (Technical / Rocky / Muddy)** adalah kompromi paling tajam antara akurasi praktis dan kemudahan input.

---

## 4. Lanskap Kompetitor & Substitusi

| Pemain / Substitusi | Kekuatan | Kelemahan | Celah Peluang (Opportunity Gap) |
| :--- | :--- | :--- | :--- |
| **Perhitungan Manual / Excel** ($Jarak + D+/100$) | Gratis, cepat bagi yang sudah tahu rumus ITRA. | Pelari pemula tidak tahu rumusnya; tidak menghitung estimasi waktu/*effective pace*; tidak memperhitungkan medan teknis. | Menyediakan UI interaktif yang langsung menggabungkan konversi jarak + medan teknis + estimasi *pace*/waktu dalam satu layar. |
| **Strava GAP (Grade Adjusted Pace)** | Standar emas analisis pasca-lari berbasis model Minetti + data komunitas. | Hanya bekerja **setelah** aktivitas selesai (butuh rekaman GPS/GPX); fitur mendalam terkunci di balik *paywall* Strava Subscription; mengabaikan teknis permukaan. | Fokus pada **Pre-Run / Pre-Race Planning** cukup dengan 2–3 input angka tanpa perlu file GPX atau akun. |
| **ITRA Race Calculator / Database** | Standar resmi kategori lomba *trail* dunia (Km-Effort). | Terkubur di dalam situs korporasi ITRA, UX kaku, tidak langsung menerjemahkan ke *road pace* pribadi pengguna. | UX modern, *mobile-first*, transparan menjelaskan arti angka Km-Effort terhadap kapasitas lari jalan raya pengguna. |
| **TrailMath / UltraSignup Calculators** | Sangat detail (memperhitungkan D+, D-, ketinggian/altitude, kelelahan ultra). | Terlalu kompleks (*cognitive overload*) untuk pelari yang hanya ingin jawaban cepat dalam 10 detik. | Pendekatan * progressive disclosure*: 2 input wajib di depan, opsi *pace* & *terrain* yang intuitif tanpa membebani pengguna. |

---

## 5. Hipotesis Produk & Metrik Sukses

### Hipotesis Inti
- **Hipotesis 1 (Value Proposition):** Kami percaya **pelari road-to-trail dan pelari trail rekreasional** mengalami **kesulitan membayangkan beban fisik dan target waktu dari spesifikasi jarak & elevasi rute trail**. Jika kami membangun **kalkulator web tanpa login yang mengonversi Jarak + Elevasi (+ Opsi Medan) menjadi Ekuivalen Jarak Road dan Estimasi Waktu Tempuh**, maka **pengguna akan menyelesaikan perhitungan dan membagikan/menyimpan hasilnya untuk perencanaan lari mereka**. Kami tahu ini benar jika **Calculation Completion Rate $\ge 70\%$** dari pengunjung unik.
- **Hipotesis 2 (Differentiation over Mental Math):** Kami percaya bahwa **menambahkan pengali tingkat kesulitan medan (Terrain Technicality) dan konversi Flat Road Pace ke Estimasi Waktu Trail** memberikan nilai tambah nyata di atas sekadar hitung kepala ($D+/100$). Kami tahu ini benar jika **$\ge 40\%$ pengguna yang menghitung juga berinteraksi dengan input opsional (Terrain Selector atau Flat Road Pace)**.

### Metrik Sukses (MVP)
1. **Primary Metric — Calculation Completion Rate (CCR):** Persentase *unique visitors* yang memasukkan Jarak & Elevasi hingga menghasilkan output valid (Target: $\ge 70\%$).
2. **Secondary Metric — Advanced Input Engagement Rate:** Persentase sesi kalkulasi yang menggunakan fitur *Flat Road Pace* atau mengubah opsi *Terrain Technicality* (Target: $\ge 40\%$).
3. **Virality / Utility Signal — Share/Copy Rate:** Persentase pengguna yang menekan tombol "Copy Result / Share Summary" untuk dikirim ke WhatsApp/grup lari (Target: $\ge 10\%$).

---

## 6. Batas Scope MVP (MoSCoW)

Prinsip: *"Apa yang terjadi pada hipotesis inti kalau fitur ini dihapus?"* Jika hipotesis tetap bisa diuji, fitur dikeluarkan dari MVP.

### In Scope (Must Have & Should Have)
- **[Must] Core Effort Converter (ITRA Km-Effort):** Input **Jarak Trail (km)** dan **Elevation Gain D+ (meter)** dengan kalkulasi reaktif/*real-time* menghasilkan **Road Distance Equivalent (km)** serta persentase tambahan beban dibanding jarak aslinya.
- **[Must] Terrain Technicality Selector:** Pilihan tingkat kesulitan jalur (misal: *Smooth/Playable Trail* [+0%], *Moderate Singletrack* [+10% effort], *Technical/Rocky/Muddy* [+20% effort]) untuk menguji Hipotesis 2 dan menjawab kelemahan rumus ITRA murni.
- **[Must] Road Pace to Trail Time Estimator:** Input opsional **Flat Road Pace (menit:detik / km)** yang secara otomatis menghitung **Estimasi Total Waktu Tempuh Trail (jam:menit)** dan **Effective Trail Pace (menit:detik / km)**.
- **[Should] ITRA Category & Benchmark Badge:** Menampilkan kategori jarak ITRA secara otomatis (XXS s/d XXL) beserta pembanding visual yang akrab bagi pelari *road* (misal: *"Setara ~1.4x Half Marathon di jalan raya"*).
- **[Should] Quick Presets & Copyable Summary:** Tombol *preset* skenario populer (misal: "Trail 10K Bukit", "21K Mountain", "50K Ultra") untuk coba instan 1 klik, serta tombol **"Copy Ringkasan"** berformat teks rapi siap tempel ke WhatsApp/Strava.

### Out of Scope (Won't Have di MVP — Eksplisit Ditolak)
- **Autentikasi, Login, atau Profil Pengguna:** Menambah friksi tanpa alasan; semua berjalan *client-side*.
- **Database Riwayat Lari (Run History / Cloud Sync):** Tidak diperlukan untuk memvalidasi apakah rumus dan alat konversi ini berguna.
- **Upload & Parsing File GPX/FIT:** Terlalu berat secara teknis untuk MVP dan menghambat pengguna yang baru melihat poster lomba (belum punya GPX).
- **Integrasi API Pihak Ketiga (Strava, Garmin, Coros):** Di luar scope validasi nilai inti.

### Parking Lot (Ditunda — Beserta Syarat Ditinjau Ulang)
1. **Reverse Calculator ("Road to Trail Target"):** Input target kilometer *road* di program latihan (misal: program meminta *long run* 25 km *road*), lalu mencari kombinasi jarak + D+ *trail* yang setara. *(Ditinjau ulang jika CCR $\ge 70\%$ dan ada $\ge 15$ permintaan kualitatif dari komunitas).*
2. **Elevation Loss (D-) Eccentric Penalty Input:** Memisahkan input tanjakan (D+) dan turunan (D-) untuk rute *point-to-point* (non-loop). *(Ditinjau ulang jika pengguna mengeluhkan ketidakakuratan pada rute non-loop).*
3. **GPX Route Analyzer & Split Table per Pos (Aid Station):** Upload GPX untuk memotong estimasi waktu per segmen kemiringan berbasis model Minetti. *(Ditinjau ulang hanya setelah MVP mencapai >1.000 pengguna aktif bulanan).*
4. **Altitude & Heat/Humidity Adjustment:** Faktor koreksi untuk lari di atas ketinggian 2.000 mdpl atau cuaca tropis ekstrem. *(Ditinjau ulang pada iterasi V2).*

---

## 7. User Stories & Acceptance Criteria

### US-1: Konversi Instan Jarak & Elevasi ke Ekuivalen Road (Core)
**Sebagai** pelari yang ingin mengikuti *trail run*,  
**Saya ingin** memasukkan jarak (km) dan total tanjakan/D+ (m),  
**Agar** saya langsung mengetahui setara berapa kilometer lari di jalan datar (*road*).

**Acceptance Criteria:**
- **Given** pengguna berada di halaman utama kalkulator tanpa perlu login,
- **When** pengguna memasukkan `Jarak = 20` km dan `Elevation Gain = 1000` m (dengan medan default *Smooth/Standard ITRA*),
- **Then** sistem secara instan menampilkan **30.0 km** sebagai *Flat Road Equivalent (Km-Effort)*, menampilkan rincian (+10.0 km dari elevasi / +50% ekstra *effort*), dan menampilkan kategori **ITRA XS (20–34 Km-Effort)**.
- **Given** pengguna memasukkan nilai negatif atau karakter non-angka,
- **When** input divalidasi,
- **Then** sistem mencegah input tidak valid dan menampilkan pesan bantu yang jelas tanpa membuat aplikasi *crash*.

### US-2: Penyesuaian Tingkat Kesulitan Medan (Terrain Technicality)
**Sebagai** pelari *trail*,  
**Saya ingin** memilih kondisi permukaan jalur (mudah, sedang, atau teknikal/berbatu),  
**Agar** hasil konversi mencerminkan perlambatan akibat medan yang tidak rata, bukan hanya kemiringan.

**Acceptance Criteria:**
- **Given** `Jarak = 20` km dan `Elevation Gain = 1000` m (Base Km-Effort = 30.0 km),
- **When** pengguna mengubah pilihan medan dari *Runable / Fire Road (0%)* ke *Moderate Trail (+10%)* atau *Technical / Rocky (+20%)*,
- **Then** sistem menampilkan **Adjusted Road Equivalent** (misal: 33.0 km untuk +10%, atau 36.0 km untuk +20%) berdampingan dengan angka **Base ITRA Km-Effort (30.0 km)** sehingga pengguna tahu selisihnya secara transparan.

### US-3: Estimasi Waktu Tempuh & Effective Trail Pace dari Flat Road Pace
**Sebagai** pelari *road* yang hafal *pace* lari datar saya,  
**Saya ingin** memasukkan *flat road pace* (menit:detik per km),  
**Agar** saya mendapatkan perkiraan total waktu selesai dan *average pace* yang realistis saat di jalur *trail*.

**Acceptance Criteria:**
- **Given** hasil ekuivalen jarak *road* adalah **30.0 km** (dari input 20 km trail, D+ 1000m),
- **When** pengguna memasukkan `Flat Road Pace = 06:00` /km,
- **Then** sistem menghitung **Estimasi Waktu Tempuh = 3 jam 00 menit** ($30.0 \times 6\text{ menit}$) dan menampilkan **Effective Trail Pace = 09:00 /km** ($180\text{ menit} / 20\text{ km}$ jarak aktual).

### US-4: Preset Skenario & Bagikan Hasil (Zero-Friction Utility)
**Sebagai** pengguna baru atau anggota komunitas lari,  
**Saya ingin** mencoba contoh rute dengan 1 klik dan menyalin hasil perhitungannya,  
**Agar** saya cepat paham cara kerja alat ini dan bisa membagikannya ke grup WhatsApp teman lari.

**Acceptance Criteria:**
- **Given** pengguna baru membuka halaman dan belum mengetik angka,
- **When** pengguna menekan salah satu tombol *Quick Preset* (misal: *"15K Trail • D+ 600m"*),
- **Then** kolom input terisi otomatis dan hasil konversi langsung tampil.
- **When** pengguna menekan tombol *"Salin Ringkasan"* (*Copy Summary*),
- **Then** teks ringkasan (berisi Jarak Trail, D+, Medan, Ekuivalen Road km, dan Estimasi Waktu) tersalin ke *clipboard* dengan umpan balik visual ("Tersalin!").

---

## 8. Kriteria Validasi (Go / Pivot / Stop)

- **Periode Pengamatan:** 14 hari pertama setelah peluncuran MVP atau setelah mencapai **200 pengunjung unik** (mana yang tercapai lebih dulu, dibagikan ke komunitas lari lokal/media sosial tanpa iklan berbayar).
- **Sinyal Keputusan:**
  - **GO (Lanjut ke iterasi fitur Parking Lot #1/#2):**
    - *Calculation Completion Rate (CCR)* $\ge 70\%$ **DAN**
    - *Advanced Input Engagement (Terrain/Pace)* $\ge 40\%$ **DAN**
    - *Share/Copy Rate* $\ge 10\%$.
  - **PIVOT (Ubah fokus/posisi produk):**
    - CCR $\ge 70\%$, **TETAPI** *Advanced Input Engagement* $< 20\%$ dan *Share/Copy Rate* $< 3\%$.
    - *Artinya:* Pengguna mengerti cara pakainya, tetapi menganggap kalkulasi dasar terlalu sepele/mudah dihitung di kepala. Pivot ke arah **Reverse Workout Planner** ("Ubah menu latihan Road Coach menjadi menu Trail") atau **Race-Specific Pacing Chart**.
  - **STOP (Hentikan pengembangan):**
    - CCR $< 40\%$ meskipun UI sudah langsung tampil di halaman utama tanpa login, yang menandakan masalah konversi ini tidak cukup menyakitkan bagi target pengguna.

---

## 9. Risiko, Asumsi Terbuka & Pertanyaan Terbuka

### Risiko & Asumsi Terbuka
1. **[Asumsi Perilaku - Risiko Tinggi]:** Pelari *road-to-trail* menggunakan patokan *pace* jalan raya yang konstan untuk mengestimasi waktu *trail*, padahal pada jarak *ultra* (>42 km) terjadi *fatigue decay* non-linear.
   - *Validasi/Mitigasi:* Tambahkan *disclaimer* eksplisit pada UI bahwa estimasi waktu paling akurat untuk jarak di bawah maraton/ultra pendek (<50 Km-Effort) dengan asumsi *steady effort*.
2. **[Asumsi Formula - Risiko Sedang]:** Faktor pengali medan teknis (+0%, +10%, +20%) adalah penyederhanaan heuristik (tidak ada satu angka tunggal di jurnal ilmiah karena sangat bergantung pada keterampilan *downhill* individu).
   - *Validasi/Mitigasi:* Jelaskan rumus secara transparan di bawah kalkulator ("Bagaimana ini dihitung?") agar pengguna percaya pada angka yang muncul.

### Pertanyaan Terbuka (Untuk Diskusi Tim / Founder)
1. Apakah kita ingin menyertakan satuan **Imperial (Miles & Feet)** pada MVP, atau cukup **Metrik (Kilometer & Meter)** terlebih dahulu mengingat standar ITRA dan pelari Indonesia/Asia-Eropa menggunakan sistem metrik? *(Keputusan Asumsi MVP: Fokus Metrik `km` dan `m` dulu untuk menjaga UI tetap bersih).*
2. Apakah kita ingin memasukkan *preset* nama lomba *trail* populer di Indonesia (misal: Tahura Trail, Siksorogo, Bromo Tengger Semeru, Mantra116) sebagai *Quick Presets* agar lebih relevan dengan pasar lokal?
