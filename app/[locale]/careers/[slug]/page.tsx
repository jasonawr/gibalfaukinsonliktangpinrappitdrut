import { notFound } from "next/navigation";

import { ApplyForm } from "@/components/apply-form";
import { getJobBySlug } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

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

        <section className="card">
          <h2>{locale === "id" ? "Deskripsi" : "Description"}</h2>
          <pre>{JSON.stringify(job.description, null, 2)}</pre>
        </section>

        <section className="card">
          <h2>{locale === "id" ? "Persyaratan" : "Requirements"}</h2>
          <pre>{JSON.stringify(job.requirements, null, 2)}</pre>
        </section>

        <section className="section">
          <h2>{locale === "id" ? "Kirim Lamaran" : "Apply Now"}</h2>
          <ApplyForm jobId={job.id} locale={locale} />
        </section>
      </div>
    </div>
  );
}
