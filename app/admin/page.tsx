import Link from "next/link";
import { ApplicationStatus, JobStatus } from "@prisma/client";

import { AdminNav } from "@/components/admin-nav";
import { LogoutButton } from "@/components/logout-button";
import { requireAdminPage } from "@/lib/admin-page";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  await requireAdminPage();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    pages,
    industries,
    leadership,
    jobs,
    applications,
    inquiries,
    openJobs,
    draftJobs,
    newApplications,
    reviewingApplications,
    shortlistedApplications,
    recentApplications,
    recentInquiries,
    recentPublishedNews,
  ] = await Promise.all([
    prisma.page.count(),
    prisma.industrySector.count(),
    prisma.leadershipProfile.count(),
    prisma.job.count(),
    prisma.jobApplication.count(),
    prisma.contactInquiry.count(),
    prisma.job.count({ where: { status: JobStatus.OPEN } }),
    prisma.job.count({ where: { status: JobStatus.DRAFT } }),
    prisma.jobApplication.count({ where: { status: ApplicationStatus.NEW } }),
    prisma.jobApplication.count({ where: { status: ApplicationStatus.REVIEWING } }),
    prisma.jobApplication.count({ where: { status: ApplicationStatus.SHORTLISTED } }),
    prisma.jobApplication.count({ where: { submittedAt: { gte: sevenDaysAgo } } }),
    prisma.contactInquiry.count({ where: { submittedAt: { gte: sevenDaysAgo } } }),
    prisma.newsPost.count({ where: { publishedAt: { gte: sevenDaysAgo } } }),
  ]);

  const applicationToInquiryRatio =
    inquiries === 0 ? 0 : Math.round((applications / inquiries) * 100);

  return (
    <div className="section">
      <div className="container">
        <div className="admin-top">
          <h1>Admin CMS Dashboard</h1>
          <LogoutButton />
        </div>
        <AdminNav />

        <div className="card-grid">
          <article className="card"><h3>Pages</h3><p>{pages}</p><Link href="/admin/pages">Manage</Link></article>
          <article className="card"><h3>Industries</h3><p>{industries}</p><Link href="/admin/industries">Manage</Link></article>
          <article className="card"><h3>Leadership</h3><p>{leadership}</p><Link href="/admin/leadership">Manage</Link></article>
          <article className="card"><h3>Jobs</h3><p>{jobs}</p><Link href="/admin/jobs">Manage</Link></article>
          <article className="card"><h3>Applications</h3><p>{applications}</p><Link href="/admin/applications">Review</Link></article>
          <article className="card"><h3>Inquiries</h3><p>{inquiries}</p><Link href="/admin/inquiries">Review</Link></article>
        </div>

        <h2 style={{ marginTop: "2rem" }}>Pipeline Snapshot</h2>
        <div className="card-grid">
          <article className="card"><h3>Open Jobs</h3><p>{openJobs}</p></article>
          <article className="card"><h3>Draft Jobs</h3><p>{draftJobs}</p></article>
          <article className="card"><h3>New Applications</h3><p>{newApplications}</p></article>
          <article className="card"><h3>Reviewing</h3><p>{reviewingApplications}</p></article>
          <article className="card"><h3>Shortlisted</h3><p>{shortlistedApplications}</p></article>
          <article className="card"><h3>App / Inquiry Ratio</h3><p>{applicationToInquiryRatio}%</p></article>
        </div>

        <h2 style={{ marginTop: "2rem" }}>Last 7 Days</h2>
        <div className="card-grid">
          <article className="card"><h3>Applications</h3><p>{recentApplications}</p></article>
          <article className="card"><h3>Inquiries</h3><p>{recentInquiries}</p></article>
          <article className="card"><h3>Published News</h3><p>{recentPublishedNews}</p></article>
        </div>
      </div>
    </div>
  );
}
