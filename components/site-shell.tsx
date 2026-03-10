import Link from "next/link";
import { type ReactNode } from "react";

import { copy, type AppLocale } from "@/lib/i18n";

type Props = {
  locale: AppLocale;
  children: ReactNode;
};

export function SiteShell({ locale, children }: Props) {
  const t = copy[locale];
  const otherLocale = locale === "en" ? "id" : "en";

  return (
    <div className="site-root">
      <header className="topbar">
        <div className="container topbar-inner">
          <Link className="brand" href={`/${locale}`}>
            <span className="brand-mark">PT</span>
            <span className="brand-text">
              PT Gibalfaukinsonliktangpinrappitdrut
              <small>(Persero) Tbk</small>
            </span>
          </Link>
          <nav className="nav">
            <Link href={`/${locale}`}>{t.nav.home}</Link>
            <Link href={`/${locale}/about`}>{t.nav.about}</Link>
            <Link href={`/${locale}/industries`}>{t.nav.industries}</Link>
            <Link href={`/${locale}/careers`}>{t.nav.careers}</Link>
            <Link href={`/${locale}/news`}>{t.nav.news}</Link>
            <Link href={`/${locale}/contact`}>{t.nav.contact}</Link>
          </nav>
          <div className="topbar-actions">
            <Link className="button ghost" href={`/${otherLocale}`}>
              {otherLocale.toUpperCase()}
            </Link>
            <Link className="button solid" href="/admin">
              {t.nav.admin}
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div className="container footer-inner">
          <div>© 2026 PT Gibalfaukinsonliktangpinrappitdrut (Persero) Tbk</div>
          <div>Indonesia</div>
        </div>
      </footer>
    </div>
  );
}
