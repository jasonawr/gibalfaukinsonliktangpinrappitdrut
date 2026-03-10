import { AdminNav } from "@/components/admin-nav";
import { CreateLeadershipForm } from "@/components/admin-forms";
import { JsonResourceEditor } from "@/components/json-resource-editor";
import { requireAdminPage } from "@/lib/admin-page";
import { prisma } from "@/lib/prisma";

export default async function AdminLeadershipPage() {
  await requireAdminPage();
  const people = await prisma.leadershipProfile.findMany({
    include: { translations: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="section">
      <div className="container">
        <h1>Manage Leadership</h1>
        <AdminNav />
        <CreateLeadershipForm />
        <div className="list-block">
          {people.map((item) => (
            <JsonResourceEditor
              endpointBase="/api/admin/leadership"
              id={item.id}
              initialPayload={{
                slug: item.slug,
                sortOrder: item.sortOrder,
                photoUrl: item.photoUrl,
                qualificationType: item.qualificationType,
                isActive: item.isActive,
                fullNameEn:
                  item.translations.find((translation) => translation.locale === "en")
                    ?.fullName || "",
                fullNameId:
                  item.translations.find((translation) => translation.locale === "id")
                    ?.fullName || "",
                roleTitleEn:
                  item.translations.find((translation) => translation.locale === "en")
                    ?.roleTitle || "",
                roleTitleId:
                  item.translations.find((translation) => translation.locale === "id")
                    ?.roleTitle || "",
                bioEn:
                  item.translations.find((translation) => translation.locale === "en")?.bio || "",
                bioId:
                  item.translations.find((translation) => translation.locale === "id")?.bio || "",
              }}
              key={item.id}
              label={item.slug}
              subtitle={item.qualificationType}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
