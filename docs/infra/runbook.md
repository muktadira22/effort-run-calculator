# Runbook Operasional, Observabilitas & Prosedur Rollback

**Dokumen:** `docs/infra/runbook.md`  
**Tanggal:** 19 Oktober 2026  
**Penulis:** The Scaler (`devops-specialist`)  
**Layanan:** `trail-effort-converter` (v1.0.0)  
**Referensi:** `docs/infra/deployment.md`, `docs/qa/review-2026-10-19-mvp.md`

---

## 1. Arsitektur Layanan & Health Check

Aplikasi **Trail-to-Road Effort Converter** berjalan sebagai **Static Single-Page Application (SPA)** tanpa state database backend.
- **Port Container Default:** `8080` (non-root user `nginx`, `UID 101`)
- **Health Check Endpoint:** `GET /health.json`
- **Respons Sehat (`200 OK`):**
  ```json
  {
    "status": "ok",
    "service": "trail-effort-converter",
    "version": "1.0.0"
  }
  ```

---

## 2. Observabilitas & Pemantauan (Zero-Cost Monitoring)

Agar tim mengetahui gangguan **sebelum pengguna mengeluh**, konfigurasikan pemantauan ringan berikut (Estimasi Biaya: **$0/bulan**):

### 2.1 Uptime & Health Check Monitoring
Pasang monitor HTTP eksternal (misal **Cloudflare Health Checks**, **UptimeRobot Free**, atau **Better Stack Free**) dengan parameter:
- **URL Target:** `https://<domain-produksi>/health.json`
- **Metode:** `GET`
- **Interval Pengecekan:** Setiap `1–3 menit`
- **Kriteria Lulus:** Status HTTP `200` + keyword body `"status": "ok"` + waktu respons `< 2000ms`.
- **Alerting:** Kirim notifikasi ke kanal Slack/Telegram/Email tim jika gagal 2 kali berturut-turut.

### 2.2 Verifikasi Security Headers di Produksi
Setelah deployment, jalankan perintah berikut untuk memastikan rekomendasi keamanan `LOW-02` aktif:
```bash
rtk curl -I https://<domain-produksi>/health.json
```
Pastikan respons menyertakan header berikut:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy: default-src 'self'; ...`
- `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0`

---

## 3. Operasional Harian & Deployment

### 3.1 Menjalankan secara Lokal (Development & Preview)
```bash
# 1. Jalankan pemeriksaan kualitas & build produksi
rtk npm run typecheck
rtk npm run lint
rtk npm test
rtk npm run build

# 2. Preview build produksi secara lokal
rtk npm run preview
```

### 3.2 Menjalankan Container Produksi (Docker / Docker Compose)
```bash
# Build dan jalankan container di background (port default 8080)
rtk docker compose up -d --build

# Periksa status kelaikan (healthcheck) dan log container
rtk docker compose ps
rtk docker compose logs --tail=50 trail-effort-converter

# Uji endpoint healthcheck secara lokal
rtk curl -fsS http://127.0.0.1:8080/health.json
```

---

## 4. Prosedur Triage Insiden & Rollback Cepat (< 2 Menit)

### Skenario A: Situs Tidak Dapat Diakses (`5xx` / Timeout)
1. **Identifikasi:** Cek status penyedia Edge CDN ([cloudflarestatus.com](https://www.cloudflarestatus.com)) atau status container (`rtk docker compose ps`).
2. **Tindakan pada Container (Docker/VPS):**
   - Jika container berstatus `unhealthy` atau `exited`, periksa log:
     ```bash
     rtk docker compose logs --tail=100 trail-effort-converter
     ```
   - Restart layanan dengan bersih:
     ```bash
     rtk docker compose up -d --force-recreate
     ```
3. **Tindakan jika Gangguan DNS/Provider:** Aktifkan opsi failover sesuai `Exit Strategy` di `docs/infra/deployment.md`.

### Skenario B: Bug Regresi Rumus Kalkulasi atau Tampilan UI Rusak Setelah Rilis Baru
1. **Jangan lakukan *hotfix* terburu-buru langsung di branch produksi.** Lakukan **Rollback Instan** terlebih dahulu untuk memulihkan layanan bagi pengguna:
   - **Pada Cloudflare Pages / Vercel / Netlify (< 30 Detik):**
     1. Buka Dashboard $\rightarrow$ pilih proyek `trail-effort-converter` $\rightarrow$ tab **Deployments**.
     2. Cari deployment hijau terakhir yang stabil sebelum commit bermasalah.
     3. Klik menu `...` $\rightarrow$ pilih **Rollback to this deployment** (atau **Promote to Production**).
   - **Pada Docker / Container Runtime (< 2 Menit):**
     1. Checkout commit stabil sebelumnya atau ubah tag image ke versi stabil sebelumnya, lalu jalankan:
        ```bash
        rtk git revert HEAD --no-edit
        rtk docker compose up -d --build
        ```
2. **Verifikasi Pasca-Rollback:**
   - Buka halaman utama dan pastikan preset default (**Tahura / 21K Half Trail**) menampilkan angka `34.1 km` (*Adjusted Road Equivalent*) dan `31.0` (*Base ITRA Km-Effort*).
   - Pastikan `GET /health.json` mengembalikan `200 OK`.
3. **Post-Mortem & Perbaikan:**
   - Tambahkan *regression test case* baru di `src/domain/__tests__/calculator.test.ts` atau `src/components/__tests__/App.test.tsx` sebelum membuka Pull Request baru.

### Skenario C: Pemblokiran Resource oleh Content-Security-Policy (CSP)
1. **Gejala:** Font tidak termuat atau fitur baru gagal berjalan dengan pesan `Refused to load ... because it violates the following Content Security Policy directive` di Console Browser.
2. **Solusi:**
   - Perbarui directive `Content-Security-Policy` secara sinkron di ketiga file konfigurasi:
     1. `nginx.conf`
     2. `public/_headers`
     3. `vercel.json`
   - Jalankan `rtk npm run build` dan deploy ulang.
