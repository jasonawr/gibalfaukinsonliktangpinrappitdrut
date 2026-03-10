import { notFound } from "next/navigation";

import { ContactForm } from "@/components/contact-form";
import { copy, isLocale } from "@/lib/i18n";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale];

  return (
    <div className="section">
      <div className="container">
        <h1>{locale === "id" ? "Kontak & Kemitraan" : "Contact & Partnership"}</h1>
        <p>{t.contactIntro}</p>
        <div className="metric-row">
          <article className="metric">
            <span>{locale === "id" ? "Jenis Kolaborasi" : "Collaboration Type"}</span>
            <strong>{locale === "id" ? "B2B & Strategis" : "B2B & Strategic"}</strong>
          </article>
          <article className="metric">
            <span>{locale === "id" ? "Estimasi Respon" : "Response SLA"}</span>
            <strong>{locale === "id" ? "24-48 Jam Kerja" : "24-48 Business Hours"}</strong>
          </article>
          <article className="metric">
            <span>{locale === "id" ? "Cakupan" : "Coverage"}</span>
            <strong>Indonesia</strong>
          </article>
        </div>
        <div style={{ marginTop: "1rem" }} />
        <ContactForm locale={locale} />
      </div>
    </div>
  );
}
