import { AdminNav } from "@/components/admin-nav";
import { CreateIndustryForm } from "@/components/admin-forms";
import { JsonResourceEditor } from "@/components/json-resource-editor";
import { requireAdminPage } from "@/lib/admin-page";
import { prisma } from "@/lib/prisma";

export default async function AdminIndustriesPage() {
  await requireAdminPage();
  const industries = await prisma.industrySector.findMany({
    include: { translations: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="section">
      <div className="container">
        <h1>Manage Industries</h1>
        <AdminNav />
        <CreateIndustryForm />
        <div className="list-block">
          {industries.map((item) => (
            <JsonResourceEditor
              endpointBase="/api/admin/industries"
              id={item.id}
              initialPayload={{
                key: item.key,
                sortOrder: item.sortOrder,
                isActive: item.isActive,
                nameEn:
                  item.translations.find((translation) => translation.locale === "en")?.name ||
                  "",
                nameId:
                  item.translations.find((translation) => translation.locale === "id")?.name ||
                  "",
                summaryEn:
                  item.translations.find((translation) => translation.locale === "en")?.summary ||
                  "",
                summaryId:
                  item.translations.find((translation) => translation.locale === "id")?.summary ||
                  "",
                contentEn:
                  item.translations.find((translation) => translation.locale === "en")?.content ||
                  {},
                contentId:
                  item.translations.find((translation) => translation.locale === "id")?.content ||
                  {},
              }}
              key={item.id}
              label={item.key}
              subtitle={item.isActive ? "Active" : "Inactive"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
