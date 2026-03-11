import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { PortalAuthForm } from "@/components/portal-auth-form";
import { PORTAL_SESSION_COOKIE } from "@/lib/constants";
import { isLocale } from "@/lib/i18n";
import { verifyPortalSessionToken } from "@/lib/portal-auth";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AccountPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const cookieStore = await cookies();
  const token = cookieStore.get(PORTAL_SESSION_COOKIE)?.value;
  const session = verifyPortalSessionToken(token);
  const initialUser = session
    ? await prisma.portalUser.findUnique({
        where: { id: session.userId },
        select: { id: true, name: true, email: true, createdAt: true, isActive: true },
      })
    : null;

  return (
    <div className="section">
      <div className="container narrow">
        <h1>{locale === "id" ? "Akun" : "Account"}</h1>
        <p>
          {locale === "id"
            ? "Daftar menggunakan email untuk membuat akun, lalu login kapan saja."
            : "Create an account with email, then log in any time."}
        </p>
        <PortalAuthForm
          initialUser={initialUser && initialUser.isActive ? initialUser : null}
          locale={locale}
        />
      </div>
    </div>
  );
}
