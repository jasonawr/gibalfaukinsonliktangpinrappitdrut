import { AdminNav } from "@/components/admin-nav";
import { requireAdminPage } from "@/lib/admin-page";
import { prisma } from "@/lib/prisma";

export default async function AdminAuditLogsPage() {
  await requireAdminPage();
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="section">
      <div className="container">
        <h1>Audit Logs</h1>
        <AdminNav />
        <div className="list-block">
          {logs.map((item) => (
            <article className="list-item" key={item.id}>
              <h3>
                {item.action} · {item.entityType}
              </h3>
              <p>{item.entityId}</p>
              <small>{item.createdAt.toISOString()}</small>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
