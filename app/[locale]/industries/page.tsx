import { notFound } from "next/navigation";

import { getIndustries } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function IndustriesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const industries = await getIndustries(locale);

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
              <h3>{item.name}</h3>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
