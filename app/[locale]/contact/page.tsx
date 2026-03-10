import { notFound } from "next/navigation";

import { ContactForm } from "@/components/contact-form";
import { copy, isLocale } from "@/lib/i18n";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale];

  return (
    <div className="section">
      <div className="container">
        <h1>{locale === "id" ? "Kontak & Kemitraan" : "Contact & Partnership"}</h1>
        <p>{t.contactIntro}</p>
        <ContactForm locale={locale} />
      </div>
    </div>
  );
}
