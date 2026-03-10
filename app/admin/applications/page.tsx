import { AdminNav } from "@/components/admin-nav";
import { ApplicationStatus } from "@/components/application-status";
import { requireAdminPage } from "@/lib/admin-page";
import { prisma } from "@/lib/prisma";

export default async function AdminApplicationsPage() {
  await requireAdminPage();
  const applications = await prisma.jobApplication.findMany({
    include: { job: true },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="section">
      <div className="container">
        <h1>Job Applications</h1>
        <AdminNav />
        <div className="list-block">
          {applications.map((item) => (
            <article className="list-item" key={item.id}>
              <h3>
                {item.fullName} - {item.job.slug}
              </h3>
              <p>{item.email}</p>
              <ApplicationStatus id={item.id} status={item.status} />
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
