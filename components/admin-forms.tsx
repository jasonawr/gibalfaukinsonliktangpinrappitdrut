"use client";

import { useState } from "react";

function useSubmit() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(endpoint: string, payload: unknown) {
    setLoading(true);
    setMessage("");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      setMessage("Created successfully.");
    } else {
      const data = (await response.json()) as { error?: string };
      setMessage(data.error || "Failed.");
    }
    setLoading(false);
  }

  return { message, loading, submit };
}

export function CreatePageForm() {
  const { message, loading, submit } = useSubmit();
  return (
    <form
      className="form-grid"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        await submit("/api/admin/pages", {
          slug: form.get("slug"),
          status: form.get("status"),
          titleEn: form.get("titleEn"),
          titleId: form.get("titleId"),
          bodyEn: { hero: form.get("titleEn") },
          bodyId: { hero: form.get("titleId") },
        });
        event.currentTarget.reset();
      }}
    >
      <div className="field"><label>Slug</label><input name="slug" required /></div>
      <div className="field"><label>Status</label><select name="status"><option>DRAFT</option><option>PUBLISHED</option></select></div>
      <div className="field"><label>Title EN</label><input name="titleEn" required /></div>
      <div className="field"><label>Title ID</label><input name="titleId" required /></div>
      <button className="button solid" disabled={loading} type="submit">{loading ? "Saving..." : "Create Page"}</button>
      {message ? <p>{message}</p> : null}
    </form>
  );
}

export function CreateIndustryForm() {
  const { message, loading, submit } = useSubmit();
  return (
    <form
      className="form-grid"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        await submit("/api/admin/industries", {
          key: form.get("key"),
          sortOrder: Number(form.get("sortOrder") || 999),
          nameEn: form.get("nameEn"),
          nameId: form.get("nameId"),
          summaryEn: form.get("summaryEn"),
          summaryId: form.get("summaryId"),
          contentEn: { blocks: [{ type: "paragraph", text: form.get("summaryEn") }] },
          contentId: { blocks: [{ type: "paragraph", text: form.get("summaryId") }] },
        });
        event.currentTarget.reset();
      }}
    >
      <div className="field"><label>Key</label><input name="key" required /></div>
      <div className="field"><label>Sort</label><input name="sortOrder" type="number" defaultValue={999} /></div>
      <div className="field"><label>Name EN</label><input name="nameEn" required /></div>
      <div className="field"><label>Name ID</label><input name="nameId" required /></div>
      <div className="field field-full"><label>Summary EN</label><input name="summaryEn" /></div>
      <div className="field field-full"><label>Summary ID</label><input name="summaryId" /></div>
      <button className="button solid" disabled={loading} type="submit">{loading ? "Saving..." : "Create Industry"}</button>
      {message ? <p>{message}</p> : null}
    </form>
  );
}

export function CreateLeadershipForm() {
  const { message, loading, submit } = useSubmit();
  return (
    <form
      className="form-grid"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        await submit("/api/admin/leadership", {
          slug: form.get("slug"),
          sortOrder: Number(form.get("sortOrder") || 999),
          qualificationType: form.get("qualificationType"),
          fullNameEn: form.get("fullName"),
          fullNameId: form.get("fullName"),
          roleTitleEn: form.get("roleTitleEn"),
          roleTitleId: form.get("roleTitleId"),
        });
        event.currentTarget.reset();
      }}
    >
      <div className="field"><label>Slug</label><input name="slug" required /></div>
      <div className="field"><label>Sort</label><input name="sortOrder" type="number" defaultValue={999} /></div>
      <div className="field"><label>Name</label><input name="fullName" required /></div>
      <div className="field"><label>Qualification</label><select name="qualificationType"><option>ENGINEERING</option><option>DOCTOR</option></select></div>
      <div className="field"><label>Role EN</label><input name="roleTitleEn" required /></div>
      <div className="field"><label>Role ID</label><input name="roleTitleId" required /></div>
      <button className="button solid" disabled={loading} type="submit">{loading ? "Saving..." : "Create Leadership"}</button>
      {message ? <p>{message}</p> : null}
    </form>
  );
}

export function CreateJobForm() {
  const { message, loading, submit } = useSubmit();
  return (
    <form
      className="form-grid"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        await submit("/api/admin/jobs", {
          slug: form.get("slug"),
          department: form.get("department"),
          location: form.get("location"),
          employmentType: form.get("employmentType"),
          status: form.get("status"),
          titleEn: form.get("titleEn"),
          titleId: form.get("titleId"),
          descriptionEn: { blocks: [{ type: "paragraph", text: form.get("titleEn") }] },
          descriptionId: { blocks: [{ type: "paragraph", text: form.get("titleId") }] },
        });
        event.currentTarget.reset();
      }}
    >
      <div className="field"><label>Slug</label><input name="slug" required /></div>
      <div className="field"><label>Status</label><select name="status"><option>OPEN</option><option>DRAFT</option><option>CLOSED</option></select></div>
      <div className="field"><label>Department</label><input name="department" required /></div>
      <div className="field"><label>Location</label><input name="location" required /></div>
      <div className="field"><label>Employment Type</label><input name="employmentType" required /></div>
      <div className="field"><label>Title EN</label><input name="titleEn" required /></div>
      <div className="field"><label>Title ID</label><input name="titleId" required /></div>
      <button className="button solid" disabled={loading} type="submit">{loading ? "Saving..." : "Create Job"}</button>
      {message ? <p>{message}</p> : null}
    </form>
  );
}

export function CreateNewsForm() {
  const { message, loading, submit } = useSubmit();
  return (
    <form
      className="form-grid"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        await submit("/api/admin/news", {
          slug: form.get("slug"),
          status: form.get("status"),
          titleEn: form.get("titleEn"),
          titleId: form.get("titleId"),
          excerptEn: form.get("excerptEn"),
          excerptId: form.get("excerptId"),
          contentEn: { blocks: [{ type: "paragraph", text: form.get("excerptEn") }] },
          contentId: { blocks: [{ type: "paragraph", text: form.get("excerptId") }] },
        });
        event.currentTarget.reset();
      }}
    >
      <div className="field"><label>Slug</label><input name="slug" required /></div>
      <div className="field"><label>Status</label><select name="status"><option>DRAFT</option><option>PUBLISHED</option></select></div>
      <div className="field"><label>Title EN</label><input name="titleEn" required /></div>
      <div className="field"><label>Title ID</label><input name="titleId" required /></div>
      <div className="field field-full"><label>Excerpt EN</label><input name="excerptEn" /></div>
      <div className="field field-full"><label>Excerpt ID</label><input name="excerptId" /></div>
      <button className="button solid" disabled={loading} type="submit">{loading ? "Saving..." : "Create News"}</button>
      {message ? <p>{message}</p> : null}
    </form>
  );
}
