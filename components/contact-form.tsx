"use client";

import { useState } from "react";

type Props = {
  locale: "en" | "id";
};

export function ContactForm({ locale }: Props) {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="form-grid"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        setStatus("");

        const form = new FormData(event.currentTarget);
        const payload = {
          type: form.get("type"),
          fullName: form.get("fullName"),
          company: form.get("company"),
          email: form.get("email"),
          phone: form.get("phone"),
          message: form.get("message"),
        };

        const response = await fetch("/api/public/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          setStatus(locale === "id" ? "Pesan berhasil dikirim." : "Inquiry submitted successfully.");
          event.currentTarget.reset();
        } else {
          const error = (await response.json()) as { error?: string };
          setStatus(error.error || (locale === "id" ? "Terjadi kesalahan." : "Something went wrong."));
        }
        setLoading(false);
      }}
    >
      <div className="field">
        <label>{locale === "id" ? "Tipe" : "Type"}</label>
        <select name="type" defaultValue="CONTACT">
          <option value="CONTACT">{locale === "id" ? "Kontak" : "Contact"}</option>
          <option value="PARTNERSHIP">{locale === "id" ? "Kemitraan" : "Partnership"}</option>
        </select>
      </div>
      <div className="field">
        <label>{locale === "id" ? "Nama" : "Full Name"}</label>
        <input name="fullName" required />
      </div>
      <div className="field">
        <label>{locale === "id" ? "Perusahaan" : "Company"}</label>
        <input name="company" />
      </div>
      <div className="field">
        <label>Email</label>
        <input name="email" type="email" required />
      </div>
      <div className="field">
        <label>{locale === "id" ? "Telepon" : "Phone"}</label>
        <input name="phone" />
      </div>
      <div className="field field-full">
        <label>{locale === "id" ? "Pesan" : "Message"}</label>
        <textarea name="message" required rows={5} />
      </div>
      <button className="button solid" type="submit" disabled={loading}>
        {loading ? (locale === "id" ? "Mengirim..." : "Submitting...") : locale === "id" ? "Kirim" : "Submit"}
      </button>
      {status ? <p>{status}</p> : null}
    </form>
  );
}
