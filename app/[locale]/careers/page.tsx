import Link from "next/link";
import { notFound } from "next/navigation";

import { getOpenJobs } from "@/lib/content";
import { copy, isLocale } from "@/lib/i18n";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CareersPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale];
  const jobs = await getOpenJobs(locale);

  return (
    <div className="section">
      <div className="container">
        <h1>{locale === "id" ? "Karier" : "Careers"}</h1>
        <p>{t.careersIntro}</p>

        <div className="list-block">
          {jobs.map((job) => (
            <article className="list-item" key={job.id}>
              <h3>{job.title}</h3>
              <p>
                {job.department} · {job.location} · {job.employmentType}
              </p>
              <Link className="button ghost" href={`/${locale}/careers/${job.slug}`}>
                {locale === "id" ? "Lihat Detail" : "View Details"}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
