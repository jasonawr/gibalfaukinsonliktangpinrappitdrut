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

        <h2>{locale === "id" ? "Kepemimpinan" : "Leadership"}</h2>
        <div className="card-grid">
          {leadership.map((person) => (
            <article className="card" key={person.id}>
              <h3>{person.fullName}</h3>
              <p>{person.roleTitle}</p>
              <small>{person.qualificationType}</small>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
