"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  label: string;
  subtitle?: string;
  endpointBase: string;
  id: string;
  initialPayload: Record<string, unknown>;
};

export function JsonResourceEditor({
  label,
  subtitle,
  endpointBase,
  id,
  initialPayload,
}: Props) {
  const router = useRouter();
  const [payload, setPayload] = useState(JSON.stringify(initialPayload, null, 2));
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <article className="list-item">
      <h3>{label}</h3>
      {subtitle ? <p>{subtitle}</p> : null}
      <div className="field field-full">
        <label>Update Payload (JSON)</label>
        <textarea
          rows={10}
          value={payload}
          onChange={(event) => setPayload(event.target.value)}
        />
      </div>
      <div className="inline-actions">
        <button
          className="button solid"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setMessage("");
            try {
              const parsed = JSON.parse(payload) as Record<string, unknown>;
              const response = await fetch(`${endpointBase}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed),
              });
              if (!response.ok) {
                const error = (await response.json()) as { error?: string };
                setMessage(error.error || "Update failed.");
              } else {
                setMessage("Updated.");
                router.refresh();
              }
            } catch {
              setMessage("Invalid JSON.");
            } finally {
              setBusy(false);
            }
          }}
          type="button"
        >
          Save
        </button>
        <button
          className="button ghost"
          disabled={busy}
          onClick={async () => {
            if (!confirm("Delete this item?")) return;
            setBusy(true);
            setMessage("");
            const response = await fetch(`${endpointBase}/${id}`, {
              method: "DELETE",
            });
            if (!response.ok) {
              const error = (await response.json()) as { error?: string };
              setMessage(error.error || "Delete failed.");
            } else {
              setMessage("Deleted.");
              router.refresh();
            }
            setBusy(false);
          }}
          type="button"
        >
          Delete
        </button>
        {message ? <small>{message}</small> : null}
      </div>
    </article>
  );
}
