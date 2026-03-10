import type { AppLocale } from "@/lib/i18n";

type FallbackIndustry = {
  id: string;
  key: string;
  name: string;
  summary: string;
  imageUrl: string;
};

type FallbackLeader = {
  id: string;
  slug: string;
  qualificationType: string;
  fullName: string;
  roleTitle: string;
  bio: string;
};

type FallbackNews = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: Date;
};

type FallbackIndustryUpdate = {
  id: string;
  sector: string;
  title: string;
  summary: string;
  dateLabel: string;
};

const industriesByLocale: Record<AppLocale, FallbackIndustry[]> = {
  en: [
    { id: "fi-1", key: "mining", name: "Mining", summary: "Responsible extraction, processing, and supply continuity for strategic minerals.", imageUrl: "https://images.unsplash.com/photo-1581091215367-59ab6dcef9a4?auto=format&fit=crop&w=1200&q=80" },
    { id: "fi-2", key: "oil-gas", name: "Oil & Gas", summary: "Integrated upstream-downstream support focused on operational safety and uptime.", imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80" },
    { id: "fi-3", key: "healthcare", name: "Hospital/Healthcare", summary: "Healthcare operations, clinical services, and hospital modernization initiatives.", imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80" },
    { id: "fi-4", key: "electrical", name: "Electrical", summary: "Industrial electrical systems, reliability engineering, and high-voltage execution.", imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80" },
    { id: "fi-5", key: "semiconductor", name: "Semiconductor", summary: "Supply chain and process support for precision semiconductor operations.", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80" },
    { id: "fi-6", key: "machinery", name: "Machinery", summary: "Heavy machinery systems integration, maintenance, and performance optimization.", imageUrl: "https://images.unsplash.com/photo-1565120130281-53ff18c6b2d2?auto=format&fit=crop&w=1200&q=80" },
    { id: "fi-7", key: "ai", name: "AI", summary: "Applied AI for predictive operations, asset intelligence, and decision automation.", imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80" },
    { id: "fi-8", key: "manufacturing", name: "Manufacturing", summary: "Lean production and industrial transformation across multisector facilities.", imageUrl: "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=1200&q=80" },
    { id: "fi-9", key: "civil-infrastructure", name: "Civil & Infrastructure", summary: "Engineering, delivery, and lifecycle support for national-scale infrastructure.", imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80" },
  ],
  id: [
    { id: "fi-1", key: "mining", name: "Pertambangan", summary: "Ekstraksi dan pemrosesan mineral strategis dengan prinsip tanggung jawab.", imageUrl: "https://images.unsplash.com/photo-1581091215367-59ab6dcef9a4?auto=format&fit=crop&w=1200&q=80" },
    { id: "fi-2", key: "oil-gas", name: "Minyak & Gas", summary: "Dukungan operasi hulu-hilir terintegrasi dengan fokus keselamatan.", imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80" },
    { id: "fi-3", key: "healthcare", name: "Rumah Sakit/Kesehatan", summary: "Operasional layanan kesehatan, klinis, dan modernisasi rumah sakit.", imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80" },
    { id: "fi-4", key: "electrical", name: "Kelistrikan", summary: "Sistem kelistrikan industri, keandalan, dan eksekusi tegangan tinggi.", imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80" },
    { id: "fi-5", key: "semiconductor", name: "Semikonduktor", summary: "Dukungan proses dan rantai pasok untuk operasi semikonduktor presisi.", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80" },
    { id: "fi-6", key: "machinery", name: "Permesinan", summary: "Integrasi sistem alat berat, perawatan, dan optimasi performa.", imageUrl: "https://images.unsplash.com/photo-1565120130281-53ff18c6b2d2?auto=format&fit=crop&w=1200&q=80" },
    { id: "fi-7", key: "ai", name: "AI", summary: "Penerapan AI untuk prediksi operasional dan otomasi keputusan.", imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80" },
    { id: "fi-8", key: "manufacturing", name: "Manufaktur", summary: "Transformasi produksi dan peningkatan efisiensi fasilitas industri.", imageUrl: "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=1200&q=80" },
    { id: "fi-9", key: "civil-infrastructure", name: "Sipil & Infrastruktur", summary: "Rekayasa, konstruksi, dan dukungan siklus hidup infrastruktur skala nasional.", imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80" },
  ],
};

const leadershipByLocale: Record<AppLocale, FallbackLeader[]> = {
  en: [
    { id: "fl-1", slug: "gibran", qualificationType: "ENGINEERING", fullName: "Gibran", roleTitle: "Director, Machinery & Industrial Systems", bio: "Engineering graduate focused on industrial systems execution." },
    { id: "fl-2", slug: "al", qualificationType: "ENGINEERING", fullName: "Al", roleTitle: "Director, Chemical Operations", bio: "Engineering graduate leading chemical operations and process safety." },
    { id: "fl-3", slug: "fauzi", qualificationType: "ENGINEERING", fullName: "Fauzi", roleTitle: "Director, Mining Operations", bio: "Engineering graduate specializing in mining operations and field delivery." },
    { id: "fl-4", slug: "kindi", qualificationType: "ENGINEERING", fullName: "Kindi", roleTitle: "Director, Electrical Systems", bio: "Engineering graduate overseeing electrical reliability and system quality." },
    { id: "fl-5", slug: "jason", qualificationType: "ENGINEERING", fullName: "Jason", roleTitle: "Director, Oil & Gas Operations", bio: "Engineering graduate leading oil and gas operations strategy." },
    { id: "fl-6", slug: "malik", qualificationType: "ENGINEERING", fullName: "Malik", roleTitle: "Deputy Director, Mining Operations", bio: "Engineering graduate supporting production continuity in mining." },
    { id: "fl-7", slug: "bintang", qualificationType: "ENGINEERING", fullName: "Bintang", roleTitle: "Deputy Director, Chemical Operations", bio: "Engineering graduate focused on process optimization in chemical units." },
    { id: "fl-8", slug: "kevin", qualificationType: "DOCTOR", fullName: "Kevin", roleTitle: "Medical Director, DR Hospital", bio: "Medical doctor driving healthcare quality and clinical governance." },
    { id: "fl-9", slug: "rafa", qualificationType: "ENGINEERING", fullName: "Rafa", roleTitle: "Deputy Director, Electrical Operations", bio: "Engineering graduate with strong electrical operations management." },
    { id: "fl-10", slug: "pipit", qualificationType: "ENGINEERING", fullName: "Pipit", roleTitle: "Director, Civil & Infrastructure", bio: "Engineering graduate leading civil and infrastructure project delivery." },
    { id: "fl-11", slug: "adrian", qualificationType: "ENGINEERING", fullName: "Adrian", roleTitle: "Director, Industrial Development", bio: "Engineering graduate focused on long-term industrial growth." },
  ],
  id: [
    { id: "fl-1", slug: "gibran", qualificationType: "ENGINEERING", fullName: "Gibran", roleTitle: "Direktur, Sistem Permesinan & Industri", bio: "Lulusan teknik dengan fokus eksekusi sistem industri." },
    { id: "fl-2", slug: "al", qualificationType: "ENGINEERING", fullName: "Al", roleTitle: "Direktur, Operasi Kimia", bio: "Lulusan teknik yang memimpin operasi kimia dan keselamatan proses." },
    { id: "fl-3", slug: "fauzi", qualificationType: "ENGINEERING", fullName: "Fauzi", roleTitle: "Direktur, Operasi Pertambangan", bio: "Lulusan teknik dengan spesialisasi operasi pertambangan." },
    { id: "fl-4", slug: "kindi", qualificationType: "ENGINEERING", fullName: "Kindi", roleTitle: "Direktur, Sistem Kelistrikan", bio: "Lulusan teknik yang mengelola keandalan sistem kelistrikan." },
    { id: "fl-5", slug: "jason", qualificationType: "ENGINEERING", fullName: "Jason", roleTitle: "Direktur, Operasi Minyak & Gas", bio: "Lulusan teknik yang memimpin strategi operasi migas." },
    { id: "fl-6", slug: "malik", qualificationType: "ENGINEERING", fullName: "Malik", roleTitle: "Wakil Direktur, Operasi Pertambangan", bio: "Lulusan teknik pendukung kesinambungan produksi pertambangan." },
    { id: "fl-7", slug: "bintang", qualificationType: "ENGINEERING", fullName: "Bintang", roleTitle: "Wakil Direktur, Operasi Kimia", bio: "Lulusan teknik dengan fokus optimasi proses operasi kimia." },
    { id: "fl-8", slug: "kevin", qualificationType: "DOCTOR", fullName: "Kevin", roleTitle: "Direktur Medis, DR Hospital", bio: "Dokter yang mendorong mutu layanan klinis dan tata kelola medis." },
    { id: "fl-9", slug: "rafa", qualificationType: "ENGINEERING", fullName: "Rafa", roleTitle: "Wakil Direktur, Operasi Kelistrikan", bio: "Lulusan teknik berpengalaman dalam manajemen operasi kelistrikan." },
    { id: "fl-10", slug: "pipit", qualificationType: "ENGINEERING", fullName: "Pipit", roleTitle: "Direktur, Sipil & Infrastruktur", bio: "Lulusan teknik yang memimpin delivery proyek sipil dan infrastruktur." },
    { id: "fl-11", slug: "adrian", qualificationType: "ENGINEERING", fullName: "Adrian", roleTitle: "Direktur, Pengembangan Industri", bio: "Lulusan teknik dengan fokus pertumbuhan industri jangka panjang." },
  ],
};

const newsByLocale: Record<AppLocale, FallbackNews[]> = {
  en: [
    { id: "fn-1", slug: "grid-reliability-electrical-2026", title: "Electrical Division Expands Grid Reliability Program", excerpt: "Cross-site reliability audits and rapid-response maintenance improve uptime across major facilities.", publishedAt: new Date("2026-03-01T00:00:00.000Z") },
    { id: "fn-2", slug: "mining-safety-operations-update", title: "Mining Operations Launch Safety Acceleration Initiative", excerpt: "New digital permit-to-work and incident prevention workflows reduce operational risk in mining sites.", publishedAt: new Date("2026-02-20T00:00:00.000Z") },
    { id: "fn-3", slug: "healthcare-service-modernization", title: "DR Hospital Modernizes Patient Service Pipeline", excerpt: "Integrated triage and clinical coordination systems improve response time and care continuity.", publishedAt: new Date("2026-02-08T00:00:00.000Z") },
  ],
  id: [
    { id: "fn-1", slug: "program-keandalan-jaringan-kelistrikan-2026", title: "Divisi Kelistrikan Perluas Program Keandalan Jaringan", excerpt: "Audit keandalan lintas fasilitas dan pemeliharaan respons cepat meningkatkan uptime operasional.", publishedAt: new Date("2026-03-01T00:00:00.000Z") },
    { id: "fn-2", slug: "update-keselamatan-operasi-pertambangan", title: "Operasi Pertambangan Luncurkan Inisiatif Percepatan Keselamatan", excerpt: "Digital permit-to-work dan alur pencegahan insiden menurunkan risiko di area tambang.", publishedAt: new Date("2026-02-20T00:00:00.000Z") },
    { id: "fn-3", slug: "modernisasi-layanan-rumah-sakit", title: "DR Hospital Modernisasi Alur Layanan Pasien", excerpt: "Integrasi triase dan koordinasi klinis mempercepat layanan serta kontinuitas perawatan.", publishedAt: new Date("2026-02-08T00:00:00.000Z") },
  ],
};

const industryUpdatesByLocale: Record<AppLocale, FallbackIndustryUpdate[]> = {
  en: [
    { id: "fu-1", sector: "Oil & Gas", title: "Terminal Throughput Optimization Program", summary: "Process stabilization plan improves dispatch cycle time and safety compliance.", dateLabel: "March 2026" },
    { id: "fu-2", sector: "Semiconductor", title: "Precision Handling Upgrade Completed", summary: "Contamination-control enhancements deployed across critical material lanes.", dateLabel: "February 2026" },
    { id: "fu-3", sector: "Civil & Infrastructure", title: "Infrastructure Delivery Framework Expanded", summary: "Standardized project governance model now active on multi-site projects.", dateLabel: "February 2026" },
  ],
  id: [
    { id: "fu-1", sector: "Minyak & Gas", title: "Program Optimasi Throughput Terminal", summary: "Rencana stabilisasi proses meningkatkan siklus dispatch dan kepatuhan keselamatan.", dateLabel: "Maret 2026" },
    { id: "fu-2", sector: "Semikonduktor", title: "Peningkatan Precision Handling Selesai", summary: "Penyempurnaan kontrol kontaminasi diterapkan pada jalur material kritis.", dateLabel: "Februari 2026" },
    { id: "fu-3", sector: "Sipil & Infrastruktur", title: "Kerangka Delivery Infrastruktur Diperluas", summary: "Model tata kelola proyek standar aktif pada proyek multi-lokasi.", dateLabel: "Februari 2026" },
  ],
};

export function getFallbackIndustries(locale: AppLocale): FallbackIndustry[] {
  return industriesByLocale[locale];
}

export function getFallbackLeadership(locale: AppLocale): FallbackLeader[] {
  return leadershipByLocale[locale];
}

export function getFallbackNews(locale: AppLocale): FallbackNews[] {
  return newsByLocale[locale];
}

export function getFallbackIndustryUpdates(locale: AppLocale): FallbackIndustryUpdate[] {
  return industryUpdatesByLocale[locale];
}
