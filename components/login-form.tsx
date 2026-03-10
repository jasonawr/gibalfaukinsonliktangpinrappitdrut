"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="form-grid"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.get("email"),
            password: form.get("password"),
          }),
        });

        if (response.ok) {
          router.push("/admin");
          router.refresh();
        } else {
          const payload = (await response.json()) as { error?: string };
          setError(payload.error || "Login failed.");
        }
        setLoading(false);
      }}
    >
      <div className="field field-full">
        <label>Email</label>
        <input name="email" type="email" defaultValue="admin@pt-gibalfaukinsonliktangpinrappitdrut.com" required />
      </div>
      <div className="field field-full">
        <label>Password</label>
        <input name="password" type="password" defaultValue="Admin@12345" required />
      </div>
      <button className="button solid" disabled={loading} type="submit">
        {loading ? "Signing in..." : "Sign In"}
      </button>
      {error ? <p>{error}</p> : null}
    </form>
  );
}
