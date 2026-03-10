import { notFound } from "next/navigation";

import { getIndustries, getIndustryUpdates } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function IndustriesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [industries, updates] = await Promise.all([
    getIndustries(locale),
    getIndustryUpdates(locale),
  ]);

  return (
    <div className="section">
      <div className="container">
        <h1>{locale === "id" ? "Industri Kami" : "Our Industries"}</h1>
        <p>
          {locale === "id"
            ? "Portofolio sektor strategis kami mendukung kebutuhan nasional hingga global."
            : "Our strategic-sector portfolio supports national to global needs."}
        </p>
        <div className="card-grid">
          {industries.map((item) => (
            <article className="card" key={item.id}>
              <p className="chip">{item.key.replace("-", " ")}</p>
              <h3>{item.name}</h3>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>

        <h2 style={{ marginTop: "2rem" }}>
          {locale === "id" ? "Update Industri Terkini" : "Recent Industry Updates"}
        </h2>
        <div className="list-block">
          {updates.map((item) => (
            <article className="list-item" key={item.id}>
              <p className="chip">{item.sector}</p>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <small>{item.dateLabel}</small>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
