import { AdminNav } from "@/components/admin-nav";
import { CreatePageForm } from "@/components/admin-forms";
import { JsonResourceEditor } from "@/components/json-resource-editor";
import { requireAdminPage } from "@/lib/admin-page";
import { prisma } from "@/lib/prisma";

export default async function AdminPagesPage() {
  await requireAdminPage();
  const pages = await prisma.page.findMany({
    include: { translations: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="section">
      <div className="container">
        <h1>Manage Pages</h1>
        <AdminNav />
        <CreatePageForm />
        <div className="list-block">
          {pages.map((item) => (
            <JsonResourceEditor
              endpointBase="/api/admin/pages"
              id={item.id}
              initialPayload={{
                slug: item.slug,
                status: item.status,
                titleEn:
                  item.translations.find((translation) => translation.locale === "en")?.title ||
                  "",
                titleId:
                  item.translations.find((translation) => translation.locale === "id")?.title ||
                  "",
                bodyEn:
                  item.translations.find((translation) => translation.locale === "en")?.body || {},
                bodyId:
                  item.translations.find((translation) => translation.locale === "id")?.body || {},
              }}
              key={item.id}
              label={item.slug}
              subtitle={item.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
