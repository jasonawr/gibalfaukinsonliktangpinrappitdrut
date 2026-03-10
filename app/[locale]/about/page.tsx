import { notFound } from "next/navigation";

import { getLeadership } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const leadership = await getLeadership(locale);

  return (
    <div className="section">
      <div className="container">
        <h1>{locale === "id" ? "Tentang Perusahaan" : "About The Company"}</h1>
        <p>
          {locale === "id"
            ? "Kami adalah grup industri terdiversifikasi dengan fokus pada keselamatan, inovasi, dan pertumbuhan berkelanjutan."
            : "We are a diversified enterprise group focused on safety, innovation, and sustainable growth."}
        </p>

        <div className="metric-row">
          <article className="metric">
            <span>{locale === "id" ? "Visi" : "Vision"}</span>
            <strong>{locale === "id" ? "Pertumbuhan Berkelanjutan" : "Sustainable Growth"}</strong>
            <p>
              {locale === "id"
                ? "Menjadi grup industri terpercaya untuk sektor-sektor strategis Indonesia."
                : "To be a trusted enterprise group across Indonesia's most strategic sectors."}
            </p>
          </article>
          <article className="metric">
            <span>{locale === "id" ? "Misi" : "Mission"}</span>
            <strong>{locale === "id" ? "Eksekusi Unggul" : "Execution Excellence"}</strong>
            <p>
              {locale === "id"
                ? "Memberikan delivery terintegrasi, aman, dan berdampak tinggi."
                : "Deliver integrated, safe, and high-impact operations and services."}
            </p>
          </article>
          <article className="metric">
            <span>{locale === "id" ? "Nilai Inti" : "Core Value"}</span>
            <strong>{locale === "id" ? "Keselamatan & Integritas" : "Safety & Integrity"}</strong>
            <p>
              {locale === "id"
                ? "Keputusan operasional selalu berbasis keselamatan, kualitas, dan kepatuhan."
                : "Operational decisions are anchored in safety, quality, and compliance."}
            </p>
          </article>
        </div>

        <h2>{locale === "id" ? "Kepemimpinan" : "Leadership"}</h2>
        <div className="card-grid">
          {leadership.map((person) => (
            <article className="card" key={person.id}>
              <p className="chip">{person.qualificationType}</p>
              <h3>{person.fullName}</h3>
              <p>{person.roleTitle}</p>
              <small>{person.bio}</small>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
