import { contact, education, experience, highlight, MORE_PROJECTS, organizations, projects, skills, SOCIAL, toArtifacts } from "./shared";
import type { Site } from "./types";

const exps = experience([
  {
    role: "Technology & Customer Success Manager",
    company: "TREEO",
    period: "Mei 2026 – Sekarang",
    body: [
      highlight(
        "Mengelola fungsi Technology dan Customer Success TREEO secara menyeluruh — bekerja dekat dengan mitra di lapangan untuk memahami kebutuhan mereka, menganalisis data lapangan dan platform untuk mendukung keputusan berbasis data, mengembangkan solusi digital yang praktis untuk memperlancar alur kerja, serta membekali mitra dengan pelatihan dan dokumentasi yang aplikatif.",
        "Mengelola fungsi Technology dan Customer Success TREEO secara menyeluruh",
      ),
    ],
  },
  {
    role: "Operations & Customer Success Manager",
    company: "TREEO",
    period: "Mei 2024 – Mei 2026",
    body: [
      highlight(
        "Menjalankan operasional harian di lima Mitra Penanaman Pohon — merencanakan dan memantau program penanaman, menjadi narahubung utama bagi setiap mitra, serta menjaga kualitas data dan pelaporan — sekaligus bertanggung jawab atas customer success di lapangan: menilai pengalaman pengguna TREEO, memantau aktivitas sistem harian, dan menyempurnakan UI/UX aplikasi.",
        "lima Mitra Penanaman Pohon",
      ),
    ],
  },
  {
    role: "Customer Success Engineer",
    company: "TREEO",
    period: "Mei 2023 – Mei 2024",
    body: [
      "Menilai dan mengevaluasi pengalaman pengguna TREEO di lapangan.",
      "Memantau aktivitas sistem harian pada platform cloud.",
      "Berkontribusi dalam penyempurnaan dan pengembangan UI/UX aplikasi.",
      highlight("Memberikan dukungan teknis dan pelatihan secara langsung kepada pengguna.", "dukungan teknis dan pelatihan secara langsung"),
    ],
  },
  {
    role: "Mobile Developer",
    company: "Konsultan Lepas",
    period: "Okt 2022 – Apr 2023",
    body: [
      highlight(
        "Merancang dan merilis aplikasi Android dengan Kotlin dan Java di Android Studio. Membuat wireframe dan mockup high-fidelity untuk platform seluler dan web, serta berkolaborasi erat dengan pemangku kepentingan untuk menerjemahkan kebutuhan bisnis menjadi antarmuka yang intuitif.",
        "aplikasi Android dengan Kotlin dan Java",
      ),
    ],
  },
  {
    role: "HPPS Project Coordinator Assistant",
    company: "Fairventures Worldwide",
    period: "Feb 2022 – Mar 2023",
    body: [
      highlight(
        "Menyiapkan alur data dan materi keselamatan kerja, mengelola proses pengumpulan dan pengolahan data, serta memastikan prosedur keselamatan yang baru diterapkan secara konsisten oleh seluruh anggota tim.",
        "prosedur keselamatan yang baru",
      ),
    ],
  },
  {
    role: "General Affairs Officer",
    company: "Fairventures Worldwide",
    period: "Okt 2019 – Feb 2022",
    body: [
      highlight(
        "Mengelola seluruh operasional kantor, meliputi administrasi kontrak, serah terima aset, koordinasi tim keamanan dan pengemudi, pemeliharaan armada kendaraan operasional, serta inventarisasi seluruh aset perusahaan.",
        "seluruh operasional kantor",
      ),
    ],
  },
  {
    role: "Demonstration Officer",
    company: "Quick Tractor",
    period: "Jul 2019 – Sep 2019",
    body: [
      highlight(
        "Mengelola komunikasi B2B secara menyeluruh serta melakukan demonstrasi produk Quick Tractor untuk perkebunan kelapa sawit di Sumatra, Sulawesi, dan Kalimantan.",
        "produk Quick Tractor",
      ),
    ],
  },
  {
    role: "Peserta Magang",
    company: "Badan Pusat Statistik (BPS)",
    period: "Jul 2018 – Des 2018",
    body: [
      highlight(
        "Merancang sampul publikasi sensus tahunan serta membuat aset visual seperti poster dan grafis vektor untuk mendukung kegiatan peluncurannya.",
        "sampul publikasi sensus tahunan",
      ),
    ],
  },
]);

export const id: Site = {
  lang: "id",
  meta: {
    title: "Mardiansyah Gunting — Membangun solusi yang membuat operasional berjalan lebih lancar",
    description:
      "Membangun solusi yang membuat operasional berjalan lebih lancar di bidang manajemen proyek, otomatisasi data, dan operasional — menjembatani tim serta menghilangkan pekerjaan yang berulang.",
  },
  name: "Mardiansyah Gunting",
  role: "Membangun solusi yang membuat operasional berjalan lebih lancar",
  status: { label: "Tersedia", note: "Terbuka untuk kolaborasi baru" },
  hero: [
    "Saya bekerja di titik temu antara operasional, teknologi, dan strategi — menjembatani tim, membangun ",
    { text: "alat yang mereka butuhkan", href: "#projects" },
    ", serta menyingkirkan pekerjaan berulang yang diam-diam memperlambat laju bisnis. Saat ini, saya melakukannya di ",
    { text: "TREEO", href: "https://treeo.id/" },
    ".",
  ],
  now: {
    lead: "Saat ini saya menjabat sebagai Technology & Customer Success Manager di",
    company: "TREEO",
    rest: "Saya mengunjungi mitra di lapangan, menganalisis data operasional untuk mendukung keputusan berbasis data, mengembangkan solusi digital yang praktis untuk memperlancar alur kerja, serta menyiapkan pelatihan dan dokumentasi yang menjadi pegangan para mitra.",
    about: [
      "Saya membangun aplikasi yang membantu orang menyelesaikan pekerjaannya dengan lebih mudah — mengotomatiskan permintaan data menggunakan bahasa pemrograman yang paling sesuai dengan konteks setiap proyek, membantu tim menyederhanakan alur kerja di balik pengumpulan data, serta mengubah proses manual yang berulang menjadi alat yang andal. Baik saat mengoordinasikan program penanaman pohon di berbagai wilayah Indonesia maupun saat merilis aplikasi Android, tujuan saya tetap sama: menghasilkan sesuatu yang terukur, bermanfaat, dan berkelanjutan.",
      "Pengalaman bekerja bersama startup, LSM internasional, dan lembaga pemerintah telah mengajarkan saya untuk cepat beradaptasi dan berkomunikasi lintas budaya — sekaligus meyakinkan saya bahwa hasil terbaik lahir dari perpaduan antara pemahaman mendalam di bidangnya dan teknologi yang tepat. Saya terbuka untuk peran maupun kolaborasi baru, dan dengan senang hati siap berdiskusi lebih lanjut.",
    ],
  },
  organizations: organizations({
    "treeo-indonesia": { name: "TREEO", note: "2026 – sekarang" },
    "fairventures-digital": { name: "TREEO", note: "TREEO · 2023 – 2026" },
    "fairventures-worldwide": { name: "Fairventures Worldwide gGmbH", note: "2019 – 2023" },
    "karya-hidup-sentosa": { name: "CV Karya Hidup Sentosa", note: "Quick · 2019" },
    bps: { name: "Badan Pusat Statistik", note: "BPS · 2018" },
  }),
  productsLine: [
    "Di luar pekerjaan sehari-hari, saya juga mengembangkan proyek pribadi — beberapa di antaranya dapat dilihat secara terbuka di ",
    { text: "GitHub", href: MORE_PROJECTS },
    ".",
  ],
  projects: projects(
    {
      "workflow-automation": {
        title: "Otomatisasi Alur Kerja",
        kind: "Internal · Python",
        summary:
          "Membangun otomasi internal untuk menyederhanakan alur kerja data (ETL: Extraction, Transformation, Loading) dan pembaruan format data. Meningkatkan efisiensi operasional harian tim melalui pengelolaan data mentah yang andal dan aman.",
        captions: ["Data mentah masuk, laporan rapi keluar — diekstrak, ditransformasi, dan dimuat secara terjadwal.", "Cara kerja otomatisasi"],
      },
      "treeo-website": {
        title: "Website TREEO Indonesia",
        kind: "Website",
        summary:
          "Berkontribusi dalam pengembangan website TREEO Indonesia dengan mengoptimalkan animasi dan merancang tata letak seluler yang responsif untuk meningkatkan performa serta pengalaman pengguna di perangkat seluler.",
        captions: ["Animasi yang lebih halus dan teroptimasi.", "Tata letak responsif yang dirancang untuk ponsel."],
      },
      "audio-transkript": {
        title: "Audio Transkript",
        kind: "Alat Python",
        summary:
          "Utilitas Python sederhana yang mengubah rekaman audio menjadi transkrip Word. pydub membaca berkas audio, rekaman yang panjang dipecah menjadi potongan berdurasi 45 detik, lalu setiap potongan dikirim ke layanan pengenalan suara berbasis cloud (bahasa Indonesia secara bawaan, bahasa lain melalui --language), dan hasil teksnya ditulis ke berkas .docx menggunakan python-docx.",
        captions: ["Audio masuk, dipecah per 45 detik, dikenali melalui speech recognition, lalu menjadi dokumen Word.", "Dijalankan melalui Jupyter Notebook."],
      },
      "cad-converter": {
        title: "Konverter CAD",
        kind: "Alat Python",
        summary:
          "Membangun utilitas Python berbasis GDAL dan GeoPandas untuk mengonversi format CAD (DWG/DXF) ke format GIS (Esri Shapefile/GeoJSON). Memfasilitasi integrasi API serta menyiapkan struktur data spasial untuk kebutuhan analisis GIS.",
        captions: ["DWG/DXF masuk, Esri Shapefile atau GeoJSON keluar.", "Layer hasil konversi, siap untuk pemetaan dan analisis GIS."],
      },
    },
    { github: "Lihat di GitHub", website: "Kunjungi website" },
  ),
  moreProjectsHref: MORE_PROJECTS,
  skills: skills(
    ["Rekayasa Perangkat Lunak", "Customer Success & Hubungan Klien", "Operasional & Manajemen Proyek", "Lapangan, Riset & Data", "Logistik & Urusan Umum"],
    { title: "Bahasa", items: ["Inggris (Profesional)", "Indonesia (Bahasa Ibu)", "Mandarin (Pemula)"] },
    {
      title: "Penerapan Keahlian di Seluruh Peran Saya",
      labels: {
        communication: "Komunikasi & Hubungan Pemangku Kepentingan",
        fieldops: "Kunjungan Lapangan & Operasional di Lokasi",
        datamonitoring: "Pemantauan, Kualitas & Pelaporan Data",
        training: "Pelatihan & Dokumentasi Pengguna",
        uiux: "UI/UX & Desain Produk",
        opsmgmt: "Operasional & Manajemen Proses",
      },
      of: (n, total) => `${n} dari ${total} peran`,
    },
  ),
  experience: exps,
  education: education([
    { school: "Universitas Terbuka", programme: "S1 Administrasi Bisnis — Ekonomi Bisnis/Manajerial", period: "2024 – Sekarang" },
    { school: "Binar Academy", programme: "Data Science Bootcamp", period: "Jun 2023 – Nov 2023" },
    { school: "Binar Academy", programme: "Mobile Development Bootcamp", period: "Des 2022 – Mei 2023" },
    { school: "SMKN 1 Sampit", programme: "Teknik Teknologi Informasi", period: "Jul 2017 – Agu 2019" },
  ]),
  artifacts: toArtifacts(exps),
  contact: contact("id"),
  social: SOCIAL,
  ui: {
    sections: {
      now: "Saat Ini",
      projects: "Proyek",
      skills: "Keahlian",
      experience: "Pengalaman",
      education: "Pendidikan",
      gallery: "Catatan Lapangan",
    },
    readMore: "Selengkapnya",
    visitSite: "Kunjungi website",
    opensNewTab: "terbuka di tab baru",
    galleryHint: "Gulir untuk menjelajah · Pilih untuk melihat lebih dekat",
    close: "Tutup",
    previous: "Sebelumnya",
    next: "Berikutnya",
    copied: "Disalin ke papan klip",
    downloadCv: "Unduh CV",
    sendMessage: "Kirim pesan",
    emailLabel: "Email",
    rights: "Hak cipta dilindungi undang-undang.",
    language: "Bahasa",
    moreProjects: "Ingin melihat lebih banyak? Lihat semua proyek saya di GitHub",
    form: {
      title: "Kirim pesan",
      name: "Nama",
      email: "Email",
      message: "Pesan",
      send: "Kirim Pesan",
      incomplete: "Mohon lengkapi semua kolom.",
      sending: "Mengirim…",
      sent: "Pesan berhasil terkirim — terima kasih!",
      error: "Pesan gagal terkirim. Silakan coba lagi atau hubungi saya langsung melalui email.",
    },
  },
};
