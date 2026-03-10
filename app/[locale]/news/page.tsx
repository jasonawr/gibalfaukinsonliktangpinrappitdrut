import { notFound } from "next/navigation";

import { getNews } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const news = await getNews(locale);
  const [featured, ...rest] = news;

  return (
    <div className="section">
      <div className="container">
        <h1>{locale === "id" ? "Berita & Insight" : "News & Insights"}</h1>
        {featured ? (
          <article className="panel" style={{ marginTop: "1rem" }}>
            <p className="chip">{locale === "id" ? "Sorotan Utama" : "Featured"}</p>
            <h2>{featured.title}</h2>
            <p>{featured.excerpt}</p>
          </article>
        ) : null}
        <div className="list-block">
          {rest.map((post) => (
            <article className="list-item" key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </article>
          ))}
          {news.length === 0 ? (
            <article className="list-item">
              <h3>{locale === "id" ? "Insight Akan Segera Hadir" : "Insights Coming Soon"}</h3>
              <p>
                {locale === "id"
                  ? "Konten editorial sedang disiapkan. Silakan kembali lagi segera."
                  : "Our editorial team is preparing new insight content. Please check back soon."}
              </p>
            </article>
          ) : null}
        </div>
      </div>
    </div>
  );
}
