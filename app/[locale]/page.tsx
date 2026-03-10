import Link from "next/link";
import { notFound } from "next/navigation";

import { copy, isLocale } from "@/lib/i18n";
import {
  getClientTestimonials,
  getFeaturedProjects,
  getHomePage,
  getIndustries,
  getIndustryUpdates,
  getLeadership,
  getNews,
} from "@/lib/content";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = copy[locale];
  const [home, industries, news, leadership, industryUpdates] = await Promise.all([
    getHomePage(locale),
    getIndustries(locale),
    getNews(locale),
    getLeadership(locale),
    getIndustryUpdates(locale),
  ]);
  const featuredProjects = getFeaturedProjects(locale);
  const testimonials = getClientTestimonials(locale);

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
          <div className="metric-row" style={{ marginTop: "1.3rem" }}>
            <article className="metric">
              <span>{locale === "id" ? "Sektor Aktif" : "Active Sectors"}</span>
              <strong>{industries.length}</strong>
            </article>
            <article className="metric">
              <span>{locale === "id" ? "Pimpinan Inti" : "Leadership Team"}</span>
              <strong>{leadership.length}</strong>
            </article>
            <article className="metric">
              <span>{locale === "id" ? "Update Industri" : "Industry Updates"}</span>
              <strong>{industryUpdates.length}</strong>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{locale === "id" ? "Cakupan Industri" : "Industry Coverage"}</h2>
          <div className="card-grid">
            {industries.map((item) => (
              <article className="card" key={item.id}>
                <img
                  alt={item.name}
                  className="card-image"
                  src={item.imageUrl}
                />
                <p className="chip">{item.key.replace("-", " ")}</p>
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

      <section className="section">
        <div className="container">
          <h2>{locale === "id" ? "Pembaruan Industri" : "Industry News Pulse"}</h2>
          <div className="card-grid">
            {industryUpdates.map((item) => (
              <article className="card" key={item.id}>
                <p className="chip">{item.sector}</p>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <small>{item.dateLabel}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{locale === "id" ? "Sorotan Proyek" : "Featured Projects"}</h2>
          <div className="card-grid">
            {featuredProjects.map((project) => (
              <article className="card" key={project.id}>
                <img alt={project.title} className="card-image" src={project.imageUrl} />
                <p className="chip">{project.sector}</p>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split-head">
            <h2>{locale === "id" ? "Direksi & Pimpinan" : "Directors & Leadership"}</h2>
            <Link className="button ghost" href={`/${locale}/about`}>
              {locale === "id" ? "Lihat Semua" : "View All"}
            </Link>
          </div>
          <div className="card-grid">
            {leadership.slice(0, 6).map((person) => (
              <article className="card" key={person.id}>
                <h3>{person.fullName}</h3>
                <p>{person.roleTitle}</p>
                <small>{person.qualificationType}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{locale === "id" ? "Apa Kata Mitra Kami" : "What Partners Say"}</h2>
          <div className="card-grid">
            {testimonials.map((item) => (
              <article className="card" key={item.id}>
                <p>&ldquo;{item.quote}&rdquo;</p>
                <h3 style={{ marginTop: "0.8rem" }}>{item.author}</h3>
                <small>{item.role}</small>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
