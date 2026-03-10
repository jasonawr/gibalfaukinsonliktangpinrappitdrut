import Link from "next/link";

export function AdminNav() {
  return (
    <nav className="admin-nav">
      <Link href="/admin">Dashboard</Link>
      <Link href="/admin/pages">Pages</Link>
      <Link href="/admin/industries">Industries</Link>
      <Link href="/admin/leadership">Leadership</Link>
      <Link href="/admin/jobs">Jobs</Link>
      <Link href="/admin/news">News</Link>
      <Link href="/admin/applications">Applications</Link>
      <Link href="/admin/inquiries">Inquiries</Link>
      <Link href="/admin/audit-logs">Audit Logs</Link>
    </nav>
  );
}
