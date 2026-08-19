# 📖 BUKU PANDUAN PENGGUNAAN APLIKASI
## SPV DPK ASSISTANT (SISTEM PENDAMPINGAN & TURNAROUND TOKO BASMALAH)

Dokumen ini berisi panduan operasional langkah demi langkah (*Standar Operasional Prosedur*) untuk mengoperasikan seluruh menu dan fitur aplikasi **SPV DPK**.

---

## 🔑 1. AKSES & KEAMANAN AKUN (LOGIN)

### A. Membuka Aplikasi
Aplikasi dapat dibuka melalui browser (Google Chrome, Microsoft Edge, Safari) di Laptop maupun Smartphone melalui tautan:
- **Tautan Live**: [https://spvdpk.vercel.app](https://spvdpk.vercel.app)
- **Akses Lokal Laptop**: `http://localhost:3000`

### B. Akun Masuk Bawaan (Default):
- **Username**: `spvdpk`
- **Password**: `spvdpk1745`

### C. Mengubah Username, Password, atau Profil SPV:
1. Klik **Nama Akun / Avatar Profil** di pojok kanan atas Navbar.
2. Pada tab **Identitas Profil**, Anda dapat mengubah *Nama Lengkap, Jabatan, Departemen, dan Nama Manajer Bisnis*.
3. Pada tab **Ganti User & Password**, masukkan password lama, lalu ketik username baru dan password baru yang Anda inginkan.
4. Klik tombol **Simpan**. Modal akan otomatis tertutup dan password baru langsung aktif serta tersimpan permanen di Database Cloud.

### D. Keluar (Logout):
- Klik ikon **Logout** (di sebelah kanan avatar profil).
- Konfirmasi dengan menekan tombol **"Ya, Keluar"** pada kotak dialog.

---

## 📊 2. MENU: DASHBOARD OVERVIEW (PUSAT KENDALI SUPERVISI)

Menu ini adalah halaman utama begitu Anda berhasil login, berfungsi memberikan gambaran umum kondisi seluruh toko binaan DPK dalam 1 pandangan.

### Cara Membaca Informasi:
1. **4 Kartu Metrik Angka (KPI Atas)**:
   - **Total Cabang DPK**: Jumlah seluruh cabang yang berada dalam pengawasan khusus.
   - **Cabang Kritis**: Jumlah toko dengan tingkat urgensi tinggi yang membutuhkan intervensi intensif.
   - **Siap Lulus / Lulus**: Jumlah toko yang performanya sudah pulih dan siap diajukan keluar dari status DPK.
   - **Log Kunjungan Bulan Ini**: Akumulasi total kunjungan fisik yang telah Anda lakukan.
2. **Daftar Status Cabang Binaan**:
   - Menampilkan kartu setiap cabang, nama KTB (Kepala Toko Basmalah), kategori masalah, persentase pencapaian omzet harian, dan progres penyelesaian *Action Plan*.
   - **Aksi Cepat**: Klik pada kotak cabang mana saja untuk langsung masuk ke halaman detail toko dan analisis akar masalah (RCA).

---

## 🏪 3. MENU: CABANG & DIAGNOSTIK RCA (ROOT CAUSE ANALYSIS)

Menu ini digunakan untuk mendaftarkan toko baru yang masuk masa DPK dan melakukan diagnosa mendalam mencari akar penyebab permasalahan toko.

### A. Menambah Toko DPK Baru:
1. Klik tombol hijau **`+ Tambah Cabang DPK`** di pojok kanan atas.
2. Isi formulir:
   - **Kode Cabang**: Contoh `M3017`
   - **Nama Cabang**: Contoh `Cabang Basmalah Bugih`
   - **Nama KTB (Kepala Toko Basmalah)**: Nama penanggung jawab toko.
   - **SPV Area & Manajer Bisnis**: Nama atasan/rekan wilayah kerja.
   - **Target Sales / Hari, Target Margin (%), dan Plafon Biaya Opex / Bulan**.
   - **Kategori Masalah Utama**: Pilih antara *Sales Drop, Margin Rendah/Minus, Biaya Opex Bengkak, Susut/NKL Tinggi, Traffic Rendah, atau Kedisiplinan SDM*.
3. Klik **Simpan Cabang**. Data langsung tersinkron ke Cloud.

### B. Menganalisis Akar Masalah (Metode 5-Why & 4M+1E):
1. Pilih dan klik cabang yang ingin dianalisis.
2. Di halaman detail toko, masuk ke bagian **Diagnostik Akar Masalah (RCA)**.
3. Anda dapat meninjau faktor:
   - **Man (SDM)**: Keterampilan kasir menawarkan promo, motivasi kru, kepemimpinan KTB.
   - **Method (SOP/Metode)**: Disiplin FEFO, kebersihan lorong, administrasi retur BAP ke DC.
   - **Material (Barang Dagangan)**: Ketersediaan barang fast moving, stok out barang promo.
   - **Machine/Environment**: Kondisi freezer/chiller, lampu penerangan, kenyamanan parkir.
4. Tuliskan **Ringkasan Diagnosa & Strategi Penyelamatan** pada kolom yang tersedia, lalu klik **Simpan**.

---

## 🎯 4. MENU: PROGRAM AKSI PERBAIKAN (ACTION PLAN & MILESTONES)

Menu ini memandu rencana kerja terstruktur mingguan selama toko dalam masa pendampingan (Turnaround Program).

### Cara Mengelola Action Plan:
1. **Pilih Cabang** melalui dropdown di bagian atas.
2. Setiap toko dibagi menjadi tahapan mingguan (**Milestone**), contoh:
   - *Minggu 1: Audit Stok & Pembenahan Dasar Toko*
   - *Minggu 2: Strategi Up-selling Kasir & Promo Katalog*
   - *Minggu 3: Penataan Ulang Display Produk Margin Tinggi*
   - *Minggu 4+: Efisiensi Biaya Operasional & Evaluasi Mandiri*
3. **Mencentang Tugas Selesai**:
   - Jika KTB atau kru toko telah melaksanakan instruksi kerja, klik centang pada kotak tugas.
   - Progres bar persentase akan bertambah secara otomatis.
4. **Menambah Tugas Baru**:
   - Klik tombol **`+ Tambah Tugas`** di bawah milestone terkait.
   - Tentukan nama tugas, penanggung jawab (*PIC: KTB, Kasir, Pramuniaga, atau SPV DPK*), dan frekuensi pengerjaan (*Harian/Mingguan*).

---

## 📋 5. MENU: KUNJUNGAN & COACHING (LOG LAPANGAN MOBILE)

Modul ini dirancang agar sangat nyaman dibuka dari HP saat Anda sedang melakukan inspeksi fisik langsung di toko.

### Cara Mencatat Kunjungan Toko:
1. Klik tombol hijau **`+ Input Log Kunjungan`**.
2. Isi data kunjungan:
   - **Pilih Cabang** yang dikunjungi.
   - **Tanggal & Waktu Kunjungan**.
   - **Agenda Utama**: Contoh *Audit SOP Kasir, Evaluasi Target Harian, Pengecekan Rak Promo*.
   - **Pembinaan KTB**: Catat poin bimbingan kepemimpinan yang Anda berikan kepada Kepala Toko Basmalah.
   - **Komitmen KTB**: Tuliskan janji tindakan nyata yang disepakati KTB (contoh: *"KTB berkomitmen mengecek struk kasir tiap 2 jam"*).
   - **Pembinaan Kru & Kasir**: Catat arahan kepada kasir & pramuniaga.
   - **Rating Kondisi Toko**: Berikan bintang (1 s/d 5) sesuai kondisi riil toko.
3. **Mencatat Temuan Kendala Fisik (Issues)**:
   - Jika ditemukan masalah di toko (misal: *Lampu mati, display berantakan, chiller bocor*), klik **`+ Tambah Temuan`**.
   - Masukkan deskripsi masalah dan batas waktu perbaikan (*deadline*).
4. Klik **Simpan Kunjungan**. Data langsung tersimpan online.

---

## 📈 6. MENU: MONITORING KINERJA (SALES, MARGIN, OPEX)

Menu ini digunakan untuk melacak dampak nyata dari proses pembinaan terhadap angka-angka finansial toko.

### Cara Input & Memantau Data Harian:
1. **Pilih Cabang** yang ingin dipantau.
2. Klik tombol **`+ Input Realisasi Harian`**.
3. Masukkan data:
   - Tanggal pencatatan.
   - **Sales Aktual (Rp)**: Realisasi omzet penjualan hari itu.
   - **Target Sales (Rp)**: Target omzet hari itu.
   - **Gross Margin (%)**: Persentase margin kotor yang diperoleh.
   - **Biaya Opex (Rp)**: Pengeluaran biaya operasional (listrik, lembur, perlengkapan).
   - **Jumlah Struk (Traffic)** & **Rata-rata Belanja (Basket Size)**.
4. Klik **Simpan Data**.
5. **Membaca Grafik**:
   - Grafik garis dan batang akan otomatis menggambarkan tren kenaikan omzet, margin, dan perbandingan terhadap target harian.

---

## 🎓 7. MENU: STATUS KELULUSAN DPK (GRADUATION TRACKER)

Sebuah toko dinyatakan **LULUS dari masa pengawasan DPK** jika memenuhi kriteria standar secara konsisten.

### Syarat & Evaluasi Kelulusan:
1. Toko harus mencapai target sales dan margin **selama 3 bulan berturut-turut**.
2. **5 Checklist Kriteria Kelulusan**:
   - [x] Pencapaian Sales Target >= 100%
   - [x] Target Gross Margin tercapai
   - [x] Efisiensi Biaya Opex sesuai plafon
   - [x] Skor Audit Kepatuhan SOP & 5R minimal 85 poin
   - [x] Kemandirian KTB & Tim Toko dalam menjalankan rutinitas evaluasi mandiri
3. **Mencatat Best Practice (Pembelajaran Sukses)**:
   - Ketikkan strategi kunci yang berhasil memulihkan toko tersebut agar menjadi referensi bagi toko DPK lainnya.
4. **Pengesahan**:
   - Klik centang **Disetujui Manajer Bisnis** jika toko sudah siap dikembalikan ke pengawasan rutin SPV Area reguler.

---

## 📄 8. MENU: LAPORAN MANAJER BISNIS (EXECUTIVE REPORT)

Modul ini menghasilkan laporan formal siap cetak atau disimpan sebagai file **PDF** untuk diserahkan dalam rapat koordinasi dengan Manajer Bisnis atau jajaran Manajemen.

### Cara Mencetak / Ekspor PDF:
1. Pilih cabang yang ingin dicetak laporannya (atau pilih *Semua Cabang DPK*).
2. Periksa rekap performa, ringkasan diagnosa, progres action plan, dan catatan kunjungan terakhir.
3. Klik tombol **`🖨️ Cetak / Ekspor PDF`** di pojok kanan atas.
4. Pada jendela cetak browser:
   - Pilih *Destination: Save as PDF* (untuk simpan file PDF).
   - Atau pilih printer Anda untuk langsung mencetak di kertas A4.
5. Format laporan sudah dilengkapi kolom tanda tangan resmi untuk:
   - **Supervisor DPK**
   - **Kepala Toko Basmalah (KTB)**
   - **Manajer Bisnis**

---

## ⚠️ 9. MENU: ESKALASI KENDALA BERAT (TIKET MANAJER BISNIS)

Gunakan modul ini jika terdapat kendala berat di toko yang berada di luar wewenang Supervisor DPK dan membutuhkan keputusan atau anggaran dari Manajer Bisnis.

### Kapan Mengajukan Tiket Eskalasi?
- **Usulan Rotasi / Mutasi KTB & Kru**: Jika KTB/kru toko dinilai tidak memiliki integritas atau tidak kooperatif dalam perbaikan.
- **Kerusakan Aset Berat**: Chiller daging/susu mati total, genset rusak, kebocoran atap parah.
- **Permohonan Diskon Khusus**: Obral produk mendekati masa kedaluwarsa untuk mencegah kerugian pemusnahan total.
- **Penyesuaian Target**: Jika terjadi faktor eksternal berat (akses jalan toko ditutup proyek, bencana alam).

### Cara Mengajukan Eskalasi:
1. Klik tombol **`+ Ajukan Eskalasi ke BM`**.
2. Pilih cabang, kategori kendala, tingkat urgensi (*Tinggi/Sedang*), dan jelaskan deskripsi kendala serta usulan solusi Anda.
3. Klik **Kirim Tiket Eskalasi**.
4. **Notifikasi Otomatis**: Tiket yang belum disetujui akan memunculkan tanda badge merah berkedip pada menu sidebar sampai Manajer Bisnis memberikan disposisi/solusi.

---

## ⚙️ 10. MENU: PENGATURAN & DATA (DATABASE & CADANGAN)

Menu ini mengelola integrasi cloud dan cadangan data lokal.

### Fitur-Fitur:
1. **Status Database Cloud (Supabase)**:
   - Menampilkan status **`🟢 Auto-Sync Aktif`**.
   - Setiap kali Anda menekan tombol simpan di modul apa pun, data langsung otomatis terkirim ke server database online detik itu juga.
   - Tersedia tombol **`🔄 Sinkronkan Ulang Semua Data`** untuk memicu sinkronisasi manual jika diperlukan.
2. **Cadangan Manual (File JSON)**:
   - **Ekspor Cadangan (JSON)**: Klik untuk mengunduh salinan seluruh data ke laptop sebagai arsip bulanan pribadi.
   - **Pulihkan dari File Cadangan (Impor JSON)**: Klik untuk mengembalikan data jika Anda baru saja berganti laptop/HP baru.
3. **Reset Data Sistem**:
   - Mengembalikan data ke contoh toko bawaan (hanya gunakan jika ingin mengulang simulasi).

---

*Panduan Operasional SPV DPK Assistant - Departemen Bisnis Toko Basmalah © 2026*
