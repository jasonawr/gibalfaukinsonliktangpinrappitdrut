import { AdminNav } from "@/components/admin-nav";
import { CreateJobForm } from "@/components/admin-forms";
import { JsonResourceEditor } from "@/components/json-resource-editor";
import { requireAdminPage } from "@/lib/admin-page";
import { prisma } from "@/lib/prisma";

export default async function AdminJobsPage() {
  await requireAdminPage();
  const jobs = await prisma.job.findMany({
    include: { translations: true, applications: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="section">
      <div className="container">
        <h1>Manage Jobs</h1>
        <AdminNav />
        <CreateJobForm />
        <div className="list-block">
          {jobs.map((item) => (
            <JsonResourceEditor
              endpointBase="/api/admin/jobs"
              id={item.id}
              initialPayload={{
                slug: item.slug,
                department: item.department,
                location: item.location,
                employmentType: item.employmentType,
                status: item.status,
                titleEn:
                  item.translations.find((translation) => translation.locale === "en")?.title ||
                  "",
                titleId:
                  item.translations.find((translation) => translation.locale === "id")?.title ||
                  "",
                descriptionEn:
                  item.translations.find((translation) => translation.locale === "en")
                    ?.description || {},
                descriptionId:
                  item.translations.find((translation) => translation.locale === "id")
                    ?.description || {},
                requirementsEn:
                  item.translations.find((translation) => translation.locale === "en")
                    ?.requirements || {},
                requirementsId:
                  item.translations.find((translation) => translation.locale === "id")
                    ?.requirements || {},
              }}
              key={item.id}
              label={item.slug}
              subtitle={`${item.status} · Applications: ${item.applications.length}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
