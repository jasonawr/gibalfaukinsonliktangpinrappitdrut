import { AdminNav } from "@/components/admin-nav";
import { requireAdminPage } from "@/lib/admin-page";
import { prisma } from "@/lib/prisma";

export default async function AdminInquiriesPage() {
  await requireAdminPage();
  const inquiries = await prisma.contactInquiry.findMany({
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="section">
      <div className="container">
        <h1>Contact Inquiries</h1>
        <AdminNav />
        <div className="list-block">
          {inquiries.map((item) => (
            <article className="list-item" key={item.id}>
              <h3>
                {item.fullName} · {item.type}
              </h3>
              <p>{item.email}</p>
              <p>{item.message}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
