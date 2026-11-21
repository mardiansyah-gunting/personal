import { contact, education, experience, highlight, MORE_PROJECTS, organizations, projects, skills, SOCIAL, toArtifacts } from "./shared";
import type { Site } from "./types";

const exps = experience([
  {
    role: "Technology & Customer Success Manager",
    company: "TREEO Indonesia",
    period: "Mei 2026 – Sekarang",
    body: [
      highlight(
        "Mengelola customer success TREEO secara end-to-end, meliputi kunjungan lapangan untuk memahami kebutuhan mitra, analisis data lapangan dan platform dengan tools analisis data agar setiap keputusan berbasis data, penyempurnaan UI/UX aplikasi, serta penyusunan pelatihan dan dokumentasi yang relevan untuk mitra.",
        "Mengelola customer success TREEO secara end-to-end",
      ),
    ],
  },
  {
    role: "Operations & Customer Success Manager",
    company: "Fairventures Digital GmbH",
    period: "Mei 2024 – Mei 2026",
    body: [
      highlight(
        "Menjalankan operasional harian bersama lima Tree Planting Partners — perencanaan dan pemantauan program penanaman, kontak utama bagi setiap mitra, serta menjaga kualitas data dan pelaporan — sekaligus menangani customer success di lapangan: menilai pengalaman pengguna TREEO, memantau aktivitas harian sistem, dan menyempurnakan UI/UX aplikasi.",
        "lima Tree Planting Partners",
      ),
    ],
  },
  {
    role: "Customer Success Engineer",
    company: "Fairventures Digital GmbH",
    period: "Mei 2023 – Mei 2024",
    body: [
      "Menilai dan mengevaluasi pengalaman pengguna TREEO di lapangan.",
      "Memantau aktivitas harian sistem pada platform cloud.",
      "Berkontribusi dalam peningkatan dan pengembangan UI/UX aplikasi.",
      highlight("Memberikan dukungan teknis serta pelatihan secara langsung kepada pengguna.", "dukungan teknis serta pelatihan"),
    ],
  },
  {
    role: "Mobile Developer",
    company: "Konsultan Freelance",
    period: "Okt 2022 – Apr 2023",
    body: [
      highlight(
        "Merancang dan merilis aplikasi Android menggunakan Kotlin dan Java pada Android Studio. Membuat wireframe serta mockup beresolusi tinggi untuk platform mobile dan web, serta berkolaborasi erat dengan pemangku kepentingan untuk menerjemahkan kebutuhan bisnis menjadi antarmuka yang intuitif.",
        "aplikasi Android menggunakan Kotlin dan Java",
      ),
    ],
  },
  {
    role: "Asisten Koordinator Proyek HPPS",
    company: "Fairventures Worldwide gGmbH",
    period: "Feb 2022 – Mar 2023",
    body: [
      highlight(
        "Menyusun alur data dan materi keselamatan, mengelola proses pengumpulan serta pemrosesan data, dan memastikan penerapan prosedur keselamatan baru secara konsisten di seluruh anggota tim.",
        "prosedur keselamatan baru",
      ),
    ],
  },
  {
    role: "General Affairs Officer",
    company: "Fairventures Worldwide gGmbH",
    period: "Okt 2019 – Feb 2022",
    body: [
      highlight(
        "Mengelola seluruh operasional kantor, mencakup administrasi kontrak, serah terima aset, koordinasi tim keamanan dan pengemudi, pemeliharaan armada kendaraan operasional, serta inventarisasi seluruh aset perusahaan.",
        "seluruh operasional kantor",
      ),
    ],
  },
  {
    role: "Demonstration Officer",
    company: "CV Karya Hidup Sentosa",
    period: "Jul 2019 – Sep 2019",
    body: [
      highlight(
        "Mengelola komunikasi B2B secara menyeluruh (end-to-end) serta melakukan demonstrasi produk Quick Tractor untuk area perkebunan kelapa sawit di wilayah Sumatera, Sulawesi, dan Kalimantan.",
        "produk Quick Tractor",
      ),
    ],
  },
  {
    role: "Intern",
    company: "Badan Pusat Statistik",
    period: "Jul 2018 – Des 2018",
    body: [
      highlight(
        "Merancang desain sampul untuk publikasi Sensus tahunan serta membuat aset visual berupa poster dan grafik vektor guna mendukung kegiatan peluncuran.",
        "desain sampul untuk publikasi Sensus tahunan",
      ),
    ],
  },
]);

export const id: Site = {
  lang: "id",
  meta: {
    title: "Mardiansyah Gunting — Membangun alat yang membuat operasional berjalan lebih mulus",
    description:
      "Membangun alat yang membuat operasional berjalan lebih mulus di bidang manajemen proyek, automasi data, dan operasional — menyambungkan tim dan menghapus pekerjaan berulang.",
  },
  name: "Mardiansyah Gunting",
  role: "Membangun alat yang membuat operasional berjalan lebih mulus",
  status: { label: "Tersedia", note: "Terbuka untuk kolaborasi baru" },
  hero: [
    "Saya bekerja di titik temu antara operasional, teknologi, dan strategi — menyambungkan tim, membangun ",
    { text: "alat yang mereka butuhkan", href: "#projects" },
    ", dan menyingkirkan pekerjaan berulang yang diam-diam memperlambat bisnis. Saat ini saya melakukannya di ",
    { text: "TREEO Indonesia", href: "https://treeo.id/" },
    ".",
  ],
  now: {
    lead: "Saat ini saya menjabat sebagai Technology & Customer Success Manager di",
    company: "TREEO Indonesia",
    rest: "Saya mengunjungi mitra di lapangan, menganalisis data operasional agar setiap keputusan berbasis data, menyempurnakan UI/UX aplikasi, dan menyiapkan pelatihan serta dokumentasi yang diandalkan mitra.",
    about: [
      "Saya membangun aplikasi yang membantu orang bekerja tanpa hambatan yang tidak perlu — mengotomatiskan permintaan data dengan Python, memindahkan pelaporan dari spreadsheet yang rapuh ke sistem yang benar-benar nyaman dipakai tim, dan mengubah proses manual yang berulang menjadi perangkat yang andal. Baik sedang mengoordinasikan program penanaman pohon di seluruh Indonesia atau merilis aplikasi Android, tujuannya tetap sama: sesuatu yang terukur, berguna, dan bertahan lama.",
      "Bekerja bersama startup, NGO internasional, dan instansi pemerintah mengajarkan saya untuk cepat beradaptasi dan berkomunikasi lintas budaya — sekaligus meyakinkan saya bahwa hasil terbaik lahir dari perpaduan pemahaman domain yang nyata dengan teknologi yang tepat. Saya terbuka untuk peran dan kolaborasi baru, dan akan senang berdiskusi.",
    ],
  },
  organizations: organizations({
    "treeo-indonesia": { name: "TREEO Indonesia", note: "2026 – sekarang" },
    "fairventures-digital": { name: "Fairventures Digital GmbH", note: "TREEO · 2023 – 2026" },
    "fairventures-worldwide": { name: "Fairventures Worldwide gGmbH", note: "2019 – 2023" },
    "karya-hidup-sentosa": { name: "CV Karya Hidup Sentosa", note: "Quick · 2019" },
    bps: { name: "Badan Pusat Statistik", note: "2018" },
  }),
  productsLine: [
    "Di luar pekerjaan sehari-hari, saya juga membangun beberapa proyek sendiri — sebagian bisa dilihat di ",
    { text: "GitHub", href: MORE_PROJECTS },
    ".",
  ],
  projects: projects(
    {
      "workflow-automation": {
        title: "Automasi Workflow",
        kind: "Internal · Python",
        summary:
          "Mengembangkan skrip Python internal untuk otomatisasi alur kerja data (ETL: Extraction, Transformation, Loading) dan pembaruan format data. Meningkatkan efisiensi operasional harian tim melalui pemrosesan data mentah yang andal dan aman.",
        captions: ["Data mentah masuk, laporan rapi keluar — diekstrak, ditransformasi, dan dimuat secara terjadwal.", "Cara kerja automasi"],
      },
      "treeo-website": {
        title: "Website TREEO Indonesia",
        kind: "Website",
        summary:
          "Berkontribusi dalam pengembangan website TREEO Indonesia melalui optimalisasi animasi serta perancangan tata letak mobile yang responsif guna meningkatkan performa dan pengalaman pengguna di perangkat seluler.",
        captions: ["Animasi yang lebih mulus dan teroptimasi.", "Tata letak responsif yang dirancang untuk ponsel."],
      },
      "audio-transkript": {
        title: "Audio Transkript",
        kind: "Alat Python",
        summary:
          "Utilitas Python kecil yang mengubah rekaman audio menjadi transkrip Word. pydub membaca file, rekaman panjang dipotong per 45 detik, setiap potongan dikirim ke layanan pengenalan suara berbasis cloud (bahasa Indonesia secara bawaan, bahasa lain lewat --language), lalu teksnya ditulis ke .docx dengan python-docx.",
        captions: ["Audio masuk, dipotong per 45 detik, dikenali suaranya, dokumen Word keluar.", "Dijalankan dari Jupyter Notebook."],
      },
      "cad-converter": {
        title: "CAD Converter",
        kind: "Alat Python",
        summary:
          "Membangun utilitas Python menggunakan GDAL dan GeoPandas untuk mengonversi format CAD (DWG/DXF) ke GIS (Esri Shapefile/GeoJSON). Memfasilitasi integrasi API dan menyiapkan struktur data spasial untuk kebutuhan analisis GIS.",
        captions: ["DWG/DXF masuk, Esri Shapefile atau GeoJSON keluar.", "Layer hasil konversi, siap dipetakan dan dianalisis di GIS."],
      },
    },
    { github: "Lihat di GitHub", website: "Kunjungi website" },
  ),
  moreProjectsHref: MORE_PROJECTS,
  skills: skills(
    ["Rekayasa Perangkat Lunak", "Customer Success & Hubungan Klien", "Operasional & Manajemen Proyek", "Lapangan, Riset & Data", "Logistik & General Affairs"],
    { title: "Bahasa", items: ["Inggris (Profesional)", "Indonesia (Native)", "Mandarin (Pemula)"] },
    {
      title: "Penggunaan keahlian per peran",
      labels: {
        communication: "Komunikasi & Relasi Pemangku Kepentingan",
        fieldops: "Kunjungan Lapangan & Operasi On-site",
        datamonitoring: "Pemantauan, Kualitas & Pelaporan Data",
        training: "Pelatihan & Dokumentasi Pengguna",
        uiux: "UI/UX & Desain Produk",
        opsmgmt: "Operasi & Manajemen Proses",
      },
      of: (n, total) => `${n} dari ${total} peran`,
    },
  ),
  experience: exps,
  education: education([
    { school: "Universitas Terbuka", programme: "Sarjana Administrasi Bisnis - BBA, Ekonomi Bisnis/Manajerial", period: "2024 – Sekarang" },
    { school: "Binar Academy", programme: "Data Science Bootcamp", period: "Jun 2023 – Nov 2023" },
    { school: "Binar Academy", programme: "Mobile Development Bootcamp", period: "Des 2022 – Mei 2023" },
    { school: "SMKN 1 Sampit", programme: "Teknik Informatika", period: "Jul 2017 – Agu 2019" },
  ]),
  artifacts: toArtifacts(exps),
  contact: contact("id"),
  social: SOCIAL,
  ui: {
    sections: {
      now: "Sekarang",
      projects: "Proyek",
      skills: "Keahlian",
      experience: "Pengalaman",
      education: "Pendidikan",
      gallery: "Catatan lapangan",
    },
    readMore: "Selengkapnya",
    visitSite: "Kunjungi website",
    opensNewTab: "terbuka di tab baru",
    galleryHint: "Gulir untuk menyelam · Pilih untuk melihat lebih dekat",
    close: "Tutup",
    previous: "Sebelumnya",
    next: "Berikutnya",
    copied: "Tersalin ke clipboard",
    downloadCv: "Unduh CV",
    sendMessage: "Kirim pesan",
    emailLabel: "Email",
    phoneLabel: "Telepon",
    rights: "Hak cipta dilindungi.",
    language: "Bahasa",
    moreProjects: "Mau lihat lebih banyak? Lihat semua project saya di GitHub",
    form: {
      title: "Kirim pesan",
      name: "Nama",
      email: "Email",
      message: "Pesan",
      send: "Kirim Pesan",
      incomplete: "Mohon isi semua kolom.",
      sending: "Mengirim…",
      sent: "Pesan terkirim — terima kasih!",
      error: "Gagal mengirim. Coba lagi atau kirim email langsung.",
    },
  },
};
