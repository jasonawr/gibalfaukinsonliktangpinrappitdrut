import Link from "next/link";
import { notFound } from "next/navigation";

import { copy, isLocale } from "@/lib/i18n";
import { getHomePage, getIndustries, getNews } from "@/lib/content";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = copy[locale];
  const [home, industries, news] = await Promise.all([
    getHomePage(locale),
    getIndustries(locale),
    getNews(locale),
  ]);

  return (
    <div>
      <section className="hero">
        <div className="container">
          <p className="eyebrow">PT Gibalfaukinsonliktangpinrappitdrut (Persero) Tbk</p>
          <h1>{home?.title || "Enterprise Growth Across Strategic Sectors"}</h1>
          <p>{t.heroSub}</p>
          <div className="hero-actions">
            <Link className="button solid" href={`/${locale}/contact`}>
              {t.ctaPrimary}
            </Link>
            <Link className="button ghost" href={`/${locale}/careers`}>
              {t.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{locale === "id" ? "Cakupan Industri" : "Industry Coverage"}</h2>
          <div className="card-grid">
            {industries.map((item) => (
              <article className="card" key={item.id}>
                <h3>{item.name}</h3>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{locale === "id" ? "Insight Terbaru" : "Latest Insights"}</h2>
          <div className="list-block">
            {news.map((post) => (
              <article className="list-item" key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
