import {
  JobStatus,
  Locale,
  PrismaClient,
  PublishStatus,
  QualificationType,
  RoleName,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedRolesAndAdmin() {
  await prisma.role.upsert({
    where: { name: RoleName.ADMIN },
    update: {},
    create: { name: RoleName.ADMIN },
  });
  await prisma.role.upsert({
    where: { name: RoleName.EDITOR },
    update: {},
    create: { name: RoleName.EDITOR },
  });
  await prisma.role.upsert({
    where: { name: RoleName.HR },
    update: {},
    create: { name: RoleName.HR },
  });

  const adminRole = await prisma.role.findUniqueOrThrow({
    where: { name: RoleName.ADMIN },
  });

  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "Admin@12345";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: "admin@pt-gibalfaukinsonliktangpinrappitdrut.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@pt-gibalfaukinsonliktangpinrappitdrut.com",
      passwordHash,
      roleId: adminRole.id,
    },
  });
}

async function seedLeadership() {
  const leaders = [
    { slug: "gibran", sortOrder: 1, qualificationType: QualificationType.ENGINEERING, en: "Director, Machinery & Industrial Systems", id: "Direktur, Sistem Permesinan & Industri", name: "Gibran" },
    { slug: "al", sortOrder: 2, qualificationType: QualificationType.ENGINEERING, en: "Director, Chemical Operations", id: "Direktur, Operasi Kimia", name: "Al" },
    { slug: "fauzi", sortOrder: 3, qualificationType: QualificationType.ENGINEERING, en: "Director, Mining Operations", id: "Direktur, Operasi Pertambangan", name: "Fauzi" },
    { slug: "kindi", sortOrder: 4, qualificationType: QualificationType.ENGINEERING, en: "Director, Electrical Systems", id: "Direktur, Sistem Kelistrikan", name: "Kindi" },
    { slug: "jason", sortOrder: 5, qualificationType: QualificationType.ENGINEERING, en: "Director, Oil & Gas Operations", id: "Direktur, Operasi Minyak & Gas", name: "Jason" },
    { slug: "malik", sortOrder: 6, qualificationType: QualificationType.ENGINEERING, en: "Deputy Director, Mining Operations", id: "Wakil Direktur, Operasi Pertambangan", name: "Malik" },
    { slug: "bintang", sortOrder: 7, qualificationType: QualificationType.ENGINEERING, en: "Deputy Director, Chemical Operations", id: "Wakil Direktur, Operasi Kimia", name: "Bintang" },
    { slug: "kevin", sortOrder: 8, qualificationType: QualificationType.DOCTOR, en: "Medical Director, DR Hospital", id: "Direktur Medis, DR Hospital", name: "Kevin" },
    { slug: "rafa", sortOrder: 9, qualificationType: QualificationType.ENGINEERING, en: "Deputy Director, Electrical Operations", id: "Wakil Direktur, Operasi Kelistrikan", name: "Rafa" },
    { slug: "pipit", sortOrder: 10, qualificationType: QualificationType.ENGINEERING, en: "Director, Civil & Infrastructure", id: "Direktur, Sipil & Infrastruktur", name: "Pipit" },
    { slug: "adrian", sortOrder: 11, qualificationType: QualificationType.ENGINEERING, en: "Director, Industrial Development", id: "Direktur, Pengembangan Industri", name: "Adrian" },
  ];

  for (const leader of leaders) {
    const profile = await prisma.leadershipProfile.upsert({
      where: { slug: leader.slug },
      update: {
        sortOrder: leader.sortOrder,
        qualificationType: leader.qualificationType,
        isActive: true,
      },
      create: {
        slug: leader.slug,
        sortOrder: leader.sortOrder,
        qualificationType: leader.qualificationType,
        isActive: true,
      },
    });

    await prisma.leadershipTranslation.upsert({
      where: { profileId_locale: { profileId: profile.id, locale: Locale.en } },
      update: {
        fullName: leader.name,
        roleTitle: leader.en,
        bio: leader.qualificationType === QualificationType.DOCTOR ? "Medical doctor and healthcare executive." : "Engineering graduate with sector leadership experience.",
      },
      create: {
        profileId: profile.id,
        locale: Locale.en,
        fullName: leader.name,
        roleTitle: leader.en,
        bio: leader.qualificationType === QualificationType.DOCTOR ? "Medical doctor and healthcare executive." : "Engineering graduate with sector leadership experience.",
      },
    });

    await prisma.leadershipTranslation.upsert({
      where: { profileId_locale: { profileId: profile.id, locale: Locale.id } },
      update: {
        fullName: leader.name,
        roleTitle: leader.id,
        bio: leader.qualificationType === QualificationType.DOCTOR ? "Dokter dan eksekutif layanan kesehatan." : "Lulusan teknik dengan pengalaman memimpin sektor industri.",
      },
      create: {
        profileId: profile.id,
        locale: Locale.id,
        fullName: leader.name,
        roleTitle: leader.id,
        bio: leader.qualificationType === QualificationType.DOCTOR ? "Dokter dan eksekutif layanan kesehatan." : "Lulusan teknik dengan pengalaman memimpin sektor industri.",
      },
    });
  }
}

async function seedIndustries() {
  const industries = [
    ["mining", "Mining", "Pertambangan"],
    ["oil-gas", "Oil & Gas", "Minyak & Gas"],
    ["healthcare", "Hospital/Healthcare", "Rumah Sakit/Kesehatan"],
    ["electrical", "Electrical", "Kelistrikan"],
    ["semiconductor", "Semiconductor", "Semikonduktor"],
    ["machinery", "Machinery", "Permesinan"],
    ["ai", "AI", "AI"],
    ["manufacturing", "Manufacturing", "Manufaktur"],
    ["civil-infrastructure", "Civil & Infrastructure", "Sipil & Infrastruktur"],
  ] as const;

  for (const [idx, item] of industries.entries()) {
    const [key, nameEn, nameId] = item;
    const sector = await prisma.industrySector.upsert({
      where: { key },
      update: { sortOrder: idx + 1, isActive: true },
      create: { key, sortOrder: idx + 1, isActive: true },
    });

    await prisma.industryTranslation.upsert({
      where: { industryId_locale: { industryId: sector.id, locale: Locale.en } },
      update: {
        name: nameEn,
        summary: `${nameEn} solutions at enterprise scale.`,
        content: {
          blocks: [
            { type: "paragraph", text: `PT Gibalfaukinsonliktangpinrappitdrut delivers integrated ${nameEn} capabilities with safety and reliability first.` },
          ],
        },
      },
      create: {
        industryId: sector.id,
        locale: Locale.en,
        name: nameEn,
        summary: `${nameEn} solutions at enterprise scale.`,
        content: {
          blocks: [
            { type: "paragraph", text: `PT Gibalfaukinsonliktangpinrappitdrut delivers integrated ${nameEn} capabilities with safety and reliability first.` },
          ],
        },
      },
    });

    await prisma.industryTranslation.upsert({
      where: { industryId_locale: { industryId: sector.id, locale: Locale.id } },
      update: {
        name: nameId,
        summary: `Solusi ${nameId} untuk skala enterprise.`,
        content: {
          blocks: [
            { type: "paragraph", text: `PT Gibalfaukinsonliktangpinrappitdrut menghadirkan kapabilitas ${nameId} terintegrasi dengan prioritas keselamatan dan keandalan.` },
          ],
        },
      },
      create: {
        industryId: sector.id,
        locale: Locale.id,
        name: nameId,
        summary: `Solusi ${nameId} untuk skala enterprise.`,
        content: {
          blocks: [
            { type: "paragraph", text: `PT Gibalfaukinsonliktangpinrappitdrut menghadirkan kapabilitas ${nameId} terintegrasi dengan prioritas keselamatan dan keandalan.` },
          ],
        },
      },
    });
  }
}

async function seedPagesAndNews() {
  const home = await prisma.page.upsert({
    where: { slug: "home" },
    update: { status: PublishStatus.PUBLISHED, publishedAt: new Date() },
    create: { slug: "home", status: PublishStatus.PUBLISHED, publishedAt: new Date() },
  });

  await prisma.pageTranslation.upsert({
    where: { pageId_locale: { pageId: home.id, locale: Locale.en } },
    update: {
      title: "Building National-Scale Industries",
      body: { hero: "Diversified operations across critical sectors." },
      seoTitle: "PT Gibalfaukinsonliktangpinrappitdrut",
      seoDescription: "Diversified enterprise group in Indonesia.",
    },
    create: {
      pageId: home.id,
      locale: Locale.en,
      title: "Building National-Scale Industries",
      body: { hero: "Diversified operations across critical sectors." },
      seoTitle: "PT Gibalfaukinsonliktangpinrappitdrut",
      seoDescription: "Diversified enterprise group in Indonesia.",
    },
  });

  await prisma.pageTranslation.upsert({
    where: { pageId_locale: { pageId: home.id, locale: Locale.id } },
    update: {
      title: "Membangun Industri Skala Nasional",
      body: { hero: "Operasi terdiversifikasi di sektor-sektor kritis." },
      seoTitle: "PT Gibalfaukinsonliktangpinrappitdrut",
      seoDescription: "Grup enterprise terdiversifikasi di Indonesia.",
    },
    create: {
      pageId: home.id,
      locale: Locale.id,
      title: "Membangun Industri Skala Nasional",
      body: { hero: "Operasi terdiversifikasi di sektor-sektor kritis." },
      seoTitle: "PT Gibalfaukinsonliktangpinrappitdrut",
      seoDescription: "Grup enterprise terdiversifikasi di Indonesia.",
    },
  });

  const admin = await prisma.user.findUniqueOrThrow({
    where: { email: "admin@pt-gibalfaukinsonliktangpinrappitdrut.com" },
  });

  const news = await prisma.newsPost.upsert({
    where: { slug: "corporate-growth-2026" },
    update: { status: PublishStatus.PUBLISHED, authorId: admin.id, publishedAt: new Date() },
    create: {
      slug: "corporate-growth-2026",
      status: PublishStatus.PUBLISHED,
      authorId: admin.id,
      publishedAt: new Date(),
    },
  });

  await prisma.newsTranslation.upsert({
    where: { newsId_locale: { newsId: news.id, locale: Locale.en } },
    update: {
      title: "2026 Strategic Growth Outlook",
      excerpt: "Focused expansion in energy, healthcare, and digital sectors.",
      content: { blocks: [{ type: "paragraph", text: "Our 2026 strategic roadmap strengthens integrated delivery and talent development." }] },
      seoTitle: "2026 Strategic Growth Outlook",
      seoDescription: "PT Gibalfaukinson strategic growth outlook for 2026.",
    },
    create: {
      newsId: news.id,
      locale: Locale.en,
      title: "2026 Strategic Growth Outlook",
      excerpt: "Focused expansion in energy, healthcare, and digital sectors.",
      content: { blocks: [{ type: "paragraph", text: "Our 2026 strategic roadmap strengthens integrated delivery and talent development." }] },
      seoTitle: "2026 Strategic Growth Outlook",
      seoDescription: "PT Gibalfaukinson strategic growth outlook for 2026.",
    },
  });

  await prisma.newsTranslation.upsert({
    where: { newsId_locale: { newsId: news.id, locale: Locale.id } },
    update: {
      title: "Prospek Pertumbuhan Strategis 2026",
      excerpt: "Ekspansi terarah di sektor energi, kesehatan, dan digital.",
      content: { blocks: [{ type: "paragraph", text: "Roadmap strategis 2026 kami memperkuat delivery terintegrasi dan pengembangan talenta." }] },
      seoTitle: "Prospek Pertumbuhan Strategis 2026",
      seoDescription: "Prospek pertumbuhan strategis PT Gibalfaukinson tahun 2026.",
    },
    create: {
      newsId: news.id,
      locale: Locale.id,
      title: "Prospek Pertumbuhan Strategis 2026",
      excerpt: "Ekspansi terarah di sektor energi, kesehatan, dan digital.",
      content: { blocks: [{ type: "paragraph", text: "Roadmap strategis 2026 kami memperkuat delivery terintegrasi dan pengembangan talenta." }] },
      seoTitle: "Prospek Pertumbuhan Strategis 2026",
      seoDescription: "Prospek pertumbuhan strategis PT Gibalfaukinson tahun 2026.",
    },
  });
}

async function seedJobs() {
  const job = await prisma.job.upsert({
    where: { slug: "senior-electrical-engineer" },
    update: {
      department: "Electrical",
      location: "Jakarta",
      employmentType: "Full-Time",
      status: JobStatus.OPEN,
      postedAt: new Date(),
      closedAt: null,
    },
    create: {
      slug: "senior-electrical-engineer",
      department: "Electrical",
      location: "Jakarta",
      employmentType: "Full-Time",
      status: JobStatus.OPEN,
      postedAt: new Date(),
    },
  });

  await prisma.jobTranslation.upsert({
    where: { jobId_locale: { jobId: job.id, locale: Locale.en } },
    update: {
      title: "Senior Electrical Engineer",
      description: { blocks: [{ type: "paragraph", text: "Lead high-voltage and industrial electrical system design and commissioning." }] },
      requirements: { items: ["5+ years experience", "Bachelor in Engineering", "Project leadership"] },
    },
    create: {
      jobId: job.id,
      locale: Locale.en,
      title: "Senior Electrical Engineer",
      description: { blocks: [{ type: "paragraph", text: "Lead high-voltage and industrial electrical system design and commissioning." }] },
      requirements: { items: ["5+ years experience", "Bachelor in Engineering", "Project leadership"] },
    },
  });

  await prisma.jobTranslation.upsert({
    where: { jobId_locale: { jobId: job.id, locale: Locale.id } },
    update: {
      title: "Senior Electrical Engineer",
      description: { blocks: [{ type: "paragraph", text: "Memimpin desain dan commissioning sistem kelistrikan industri." }] },
      requirements: { items: ["Pengalaman 5+ tahun", "S1 Teknik", "Kepemimpinan proyek"] },
    },
    create: {
      jobId: job.id,
      locale: Locale.id,
      title: "Senior Electrical Engineer",
      description: { blocks: [{ type: "paragraph", text: "Memimpin desain dan commissioning sistem kelistrikan industri." }] },
      requirements: { items: ["Pengalaman 5+ tahun", "S1 Teknik", "Kepemimpinan proyek"] },
    },
  });
}

async function main() {
  await seedRolesAndAdmin();
  await seedLeadership();
  await seedIndustries();
  await seedPagesAndNews();
  await seedJobs();
  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
