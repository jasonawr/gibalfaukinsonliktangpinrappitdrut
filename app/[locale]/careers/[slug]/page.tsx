import { notFound } from "next/navigation";

import { ApplyForm } from "@/components/apply-form";
import { getJobBySlug } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

function renderRichContent(value: unknown) {
  if (!value || typeof value !== "object") return <p>No details available.</p>;

  const data = value as { blocks?: Array<{ text?: string }>; items?: string[] };
  if (Array.isArray(data.blocks) && data.blocks.length > 0) {
    return (
      <div className="list-block">
        {data.blocks.map((block, index) => (
          <article className="list-item" key={`${block.text || "block"}-${index}`}>
            <p>{block.text || "..."}</p>
          </article>
        ))}
      </div>
    );
  }

  if (Array.isArray(data.items) && data.items.length > 0) {
    return (
      <div className="list-block">
        {data.items.map((item, index) => (
          <article className="list-item" key={`${item}-${index}`}>
            <p>{item}</p>
          </article>
        ))}
      </div>
    );
  }

  return <pre>{JSON.stringify(value, null, 2)}</pre>;
}

export default async function JobDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const job = await getJobBySlug(locale, slug);
  if (!job) notFound();

  return (
    <div className="section">
      <div className="container">
        <h1>{job.title}</h1>
        <p>
          {job.department} · {job.location} · {job.employmentType}
        </p>

        <section className="panel" style={{ marginTop: "1rem" }}>
          <h2>{locale === "id" ? "Deskripsi" : "Description"}</h2>
          {renderRichContent(job.description)}
        </section>

        <section className="panel" style={{ marginTop: "1rem" }}>
          <h2>{locale === "id" ? "Persyaratan" : "Requirements"}</h2>
          {renderRichContent(job.requirements)}
        </section>

        <section className="section">
          <h2>{locale === "id" ? "Kirim Lamaran" : "Apply Now"}</h2>
          <ApplyForm jobId={job.id} locale={locale} />
        </section>
      </div>
    </div>
  );
}
