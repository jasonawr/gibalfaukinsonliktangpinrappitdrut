"use client";

import { useState } from "react";

type Props = {
  locale: "en" | "id";
  jobId: string;
};

export function ApplyForm({ locale, jobId }: Props) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="form-grid"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        setStatus("");

        const form = new FormData(event.currentTarget);
        let cvAssetId: string | undefined;

        const file = form.get("cv");
        if (file instanceof File && file.size > 0) {
          const upload = new FormData();
          upload.set("file", file);
          const uploadResponse = await fetch("/api/public/upload-cv", {
            method: "POST",
            body: upload,
          });
          if (!uploadResponse.ok) {
            const uploadError = (await uploadResponse.json()) as { error?: string };
            setStatus(uploadError.error || "CV upload failed.");
            setLoading(false);
            return;
          }
          const uploaded = (await uploadResponse.json()) as { cvAssetId?: string };
          cvAssetId = uploaded.cvAssetId;
        }

        const payload = {
          fullName: form.get("fullName"),
          email: form.get("email"),
          phone: form.get("phone"),
          coverLetter: form.get("coverLetter"),
          cvAssetId,
        };

        const response = await fetch(`/api/public/jobs/${jobId}/apply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          setStatus(locale === "id" ? "Lamaran berhasil dikirim." : "Application submitted successfully.");
          event.currentTarget.reset();
        } else {
          const error = (await response.json()) as { error?: string };
          setStatus(error.error || (locale === "id" ? "Terjadi kesalahan." : "Something went wrong."));
        }
        setLoading(false);
      }}
    >
      <div className="field">
        <label>{locale === "id" ? "Nama" : "Full Name"}</label>
        <input name="fullName" required />
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
        <label>{locale === "id" ? "Cover Letter" : "Cover Letter"}</label>
        <textarea name="coverLetter" rows={5} />
      </div>
      <div className="field field-full">
        <label>{locale === "id" ? "CV (PDF/DOC/DOCX)" : "CV (PDF/DOC/DOCX)"}</label>
        <input name="cv" type="file" accept=".pdf,.doc,.docx" />
      </div>
      <button className="button solid" type="submit" disabled={loading}>
        {loading ? (locale === "id" ? "Mengirim..." : "Submitting...") : locale === "id" ? "Kirim Lamaran" : "Apply"}
      </button>
      {status ? <p>{status}</p> : null}
    </form>
  );
}
