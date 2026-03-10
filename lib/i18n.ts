export const locales = ["en", "id"] as const;
export type AppLocale = (typeof locales)[number];

export const copy = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      industries: "Industries",
      careers: "Careers",
      news: "News",
      contact: "Contact",
      admin: "Admin",
    },
    ctaPrimary: "Start Partnership",
    ctaSecondary: "Explore Careers",
    heroSub:
      "Integrated industrial, energy, healthcare, and digital capabilities for enterprise transformation.",
    contactIntro: "Send us your inquiry and our team will respond quickly.",
    careersIntro: "Build impactful operations with a multidisciplinary leadership team.",
  },
  id: {
    nav: {
      home: "Beranda",
      about: "Tentang",
      industries: "Industri",
      careers: "Karier",
      news: "Berita",
      contact: "Kontak",
      admin: "Admin",
    },
    ctaPrimary: "Mulai Kemitraan",
    ctaSecondary: "Lihat Karier",
    heroSub:
      "Kapabilitas terintegrasi pada industri, energi, kesehatan, dan digital untuk transformasi enterprise.",
    contactIntro: "Kirim pertanyaan Anda dan tim kami akan segera merespons.",
    careersIntro: "Bangun operasi berdampak bersama tim kepemimpinan multidisiplin.",
  },
};

export function isLocale(value: string): value is AppLocale {
  return locales.includes(value as AppLocale);
}
