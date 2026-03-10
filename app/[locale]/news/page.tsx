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

  return (
    <div className="section">
      <div className="container">
        <h1>{locale === "id" ? "Berita & Insight" : "News & Insights"}</h1>
        <div className="list-block">
          {news.map((post) => (
            <article className="list-item" key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
