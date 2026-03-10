"use client";

import { useState } from "react";

type Props = {
  id: string;
  status: "NEW" | "REVIEWING" | "SHORTLISTED" | "REJECTED";
};

export function ApplicationStatus({ id, status }: Props) {
  const [value, setValue] = useState(status);
  const [message, setMessage] = useState("");

  return (
    <div className="inline-actions">
      <select
        value={value}
        onChange={(event) => setValue(event.target.value as Props["status"])}
      >
        <option>NEW</option>
        <option>REVIEWING</option>
        <option>SHORTLISTED</option>
        <option>REJECTED</option>
      </select>
      <button
        className="button ghost"
        onClick={async () => {
          const response = await fetch(`/api/admin/applications/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: value }),
          });
          setMessage(response.ok ? "Saved" : "Failed");
        }}
        type="button"
      >
        Save
      </button>
      {message ? <small>{message}</small> : null}
    </div>
  );
}
