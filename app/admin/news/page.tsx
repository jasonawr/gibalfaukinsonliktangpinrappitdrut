import { AdminNav } from "@/components/admin-nav";
import { CreateNewsForm } from "@/components/admin-forms";
import { JsonResourceEditor } from "@/components/json-resource-editor";
import { requireAdminPage } from "@/lib/admin-page";
import { prisma } from "@/lib/prisma";

export default async function AdminNewsPage() {
  await requireAdminPage();
  const posts = await prisma.newsPost.findMany({
    include: { translations: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="section">
      <div className="container">
        <h1>Manage News</h1>
        <AdminNav />
        <CreateNewsForm />
        <div className="list-block">
          {posts.map((item) => (
            <JsonResourceEditor
              endpointBase="/api/admin/news"
              id={item.id}
              initialPayload={{
                slug: item.slug,
                status: item.status,
                featuredImageUrl: item.featuredImageUrl,
                titleEn:
                  item.translations.find((translation) => translation.locale === "en")?.title ||
                  "",
                titleId:
                  item.translations.find((translation) => translation.locale === "id")?.title ||
                  "",
                excerptEn:
                  item.translations.find((translation) => translation.locale === "en")?.excerpt ||
                  "",
                excerptId:
                  item.translations.find((translation) => translation.locale === "id")?.excerpt ||
                  "",
                contentEn:
                  item.translations.find((translation) => translation.locale === "en")?.content ||
                  {},
                contentId:
                  item.translations.find((translation) => translation.locale === "id")?.content ||
                  {},
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
