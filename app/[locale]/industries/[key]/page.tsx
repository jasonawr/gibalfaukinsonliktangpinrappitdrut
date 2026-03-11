import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getIndustries } from "@/lib/content";
import { industryDetailsByLocale } from "@/lib/industry-details";
import { isLocale } from "@/lib/i18n";

type Props = {
  params: Promise<{ locale: string; key: string }>;
};

export default async function IndustryDetailPage({ params }: Props) {
  const { locale, key } = await params;
  if (!isLocale(locale)) notFound();

  const industries = await getIndustries(locale);
  const industry = industries.find((item) => item.key === key);
  if (!industry) notFound();

  const details = industryDetailsByLocale[locale][key];
  if (!details) notFound();

  return (
    <div className="section">
      <div className="container">
        <Link className="inline-link" href={`/${locale}/industries`}>
          {locale === "id" ? "<- Kembali ke semua industri" : "<- Back to all industries"}
        </Link>

        <section className="industry-hero">
          <div className="industry-hero-media">
            <Image
              alt={industry.name}
              className="industry-hero-image"
              height={600}
              src={industry.imageUrl}
              width={1000}
            />
          </div>
          <div className="industry-hero-content">
            <p className="chip">{industry.key.replace("-", " ")}</p>
            <h1>{industry.name}</h1>
            <h2>{details.headline}</h2>
            <p>{details.description}</p>
          </div>
        </section>

        <section className="section industry-detail-grid">
          <article className="panel">
            <h3>{locale === "id" ? "Kapabilitas Utama" : "Core Capabilities"}</h3>
            <ul className="feature-list">
              {details.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="panel">
            <h3>{locale === "id" ? "Kinerja Teknis" : "Technical Performance"}</h3>
            <div className="metric-row">
              {details.metrics.map((metric) => (
                <article className="metric" key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </article>
              ))}
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
