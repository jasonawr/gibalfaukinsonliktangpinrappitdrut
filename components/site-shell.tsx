import Link from "next/link";
import Image from "next/image";
import { type ReactNode } from "react";

import { copy, type AppLocale } from "@/lib/i18n";
import { ThemeToggle } from "@/components/theme-toggle";

type Props = {
  locale: AppLocale;
  children: ReactNode;
};

export function SiteShell({ locale, children }: Props) {
  const t = copy[locale];
  const otherLocale = locale === "en" ? "id" : "en";
  const locations = [
    "New York",
    "London",
    "Singapore",
    "Amsterdam",
    "Paris",
    "Rawamangun",
    "San Francisco",
  ];

  return (
    <div className="site-root">
      <header className="topbar">
        <div className="container topbar-inner">
          <Link className="brand" href={`/${locale}`}>
            <span className="brand-logo-wrap">
              <Image
                alt="PT Gibalfaukinsonliktangpinrappitdrut logo"
                className="brand-logo"
                height={56}
                src="/branding/company-logo.png"
                width={56}
              />
            </span>
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
            <Link href={`/${locale}/account`}>{t.nav.account}</Link>
            <Link href={`/${locale}/news`}>{t.nav.news}</Link>
            <Link href={`/${locale}/contact`}>{t.nav.contact}</Link>
          </nav>
          <div className="topbar-actions">
            <ThemeToggle />
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
      <section className="locations">
        <div className="container">
          <div className="split-head">
            <h2>{locale === "id" ? "Lokasi Kami" : "Our Locations"}</h2>
            <p>{locale === "id" ? "Operasi lintas kota global" : "Global multi-city operations"}</p>
          </div>
          <div className="location-grid">
            {locations.map((location) => (
              <article className="location-pill" key={location}>
                {location}
              </article>
            ))}
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="container footer-inner">
          <div>(c) 2026 PT Gibalfaukinsonliktangpinrappitdrut (Persero) Tbk</div>
          <div>Indonesia</div>
        </div>
      </footer>
    </div>
  );
}
