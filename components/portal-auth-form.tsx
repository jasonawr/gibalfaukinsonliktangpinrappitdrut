"use client";

import { useState } from "react";

type Mode = "login" | "register";

type PortalUser = {
  id: string;
  name: string;
  email: string;
  createdAt?: string | Date;
};

type Props = {
  locale: "en" | "id";
  initialUser: PortalUser | null;
};

export function PortalAuthForm({ locale, initialUser }: Props) {
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<PortalUser | null>(initialUser);

  async function loadSession() {
    const res = await fetch("/api/public/auth/me", { cache: "no-store" });
    if (!res.ok) {
      setCurrentUser(null);
      return;
    }
    const payload = (await res.json()) as PortalUser;
    setCurrentUser(payload);
  }

  async function onLogout() {
    setLoading(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/public/auth/logout", { method: "POST" });
    if (res.ok) {
      setCurrentUser(null);
      setMessage(locale === "id" ? "Logout berhasil." : "Logged out successfully.");
    } else {
      setError(locale === "id" ? "Gagal logout." : "Failed to logout.");
    }
    setLoading(false);
  }

  if (currentUser) {
    return (
      <div className="panel">
        <h2>{locale === "id" ? "Akun Anda" : "Your Account"}</h2>
        <p>
          {locale === "id" ? "Masuk sebagai" : "Signed in as"} <strong>{currentUser.email}</strong>
        </p>
        <p>{currentUser.name}</p>
        <button className="button solid" disabled={loading} onClick={onLogout} type="button">
          {loading ? "..." : locale === "id" ? "Logout" : "Logout"}
        </button>
        {message ? <p>{message}</p> : null}
        {error ? <p>{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="tabs">
        <button
          className={`tab-btn ${mode === "login" ? "active" : ""}`}
          onClick={() => setMode("login")}
          type="button"
        >
          {locale === "id" ? "Masuk" : "Sign In"}
        </button>
        <button
          className={`tab-btn ${mode === "register" ? "active" : ""}`}
          onClick={() => setMode("register")}
          type="button"
        >
          {locale === "id" ? "Daftar" : "Create Account"}
        </button>
      </div>

      <form
        className="form-grid"
        onSubmit={async (event) => {
          event.preventDefault();
          setLoading(true);
          setError("");
          setMessage("");

          const form = new FormData(event.currentTarget);
          const endpoint =
            mode === "login" ? "/api/public/auth/login" : "/api/public/auth/register";
          const payload =
            mode === "login"
              ? {
                  email: form.get("email"),
                  password: form.get("password"),
                }
              : {
                  name: form.get("name"),
                  email: form.get("email"),
                  password: form.get("password"),
                };

          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const data = (await res.json()) as { error?: string };
            setError(data.error || (locale === "id" ? "Terjadi kesalahan." : "Something went wrong."));
            setLoading(false);
            return;
          }

          await loadSession();
          setMessage(
            mode === "login"
              ? locale === "id"
                ? "Login berhasil."
                : "Login successful."
              : locale === "id"
                ? "Akun berhasil dibuat."
                : "Account created successfully.",
          );
          setLoading(false);
        }}
      >
        {mode === "register" ? (
          <div className="field field-full">
            <label>{locale === "id" ? "Nama Lengkap" : "Full Name"}</label>
            <input name="name" required type="text" />
          </div>
        ) : null}
        <div className="field field-full">
          <label>Email</label>
          <input name="email" required type="email" />
        </div>
        <div className="field field-full">
          <label>{locale === "id" ? "Kata Sandi" : "Password"}</label>
          <input minLength={8} name="password" required type="password" />
        </div>
        <button className="button solid" disabled={loading} type="submit">
          {loading
            ? "..."
            : mode === "login"
              ? locale === "id"
                ? "Masuk"
                : "Sign In"
              : locale === "id"
                ? "Buat Akun"
                : "Create Account"}
        </button>
        {message ? <p>{message}</p> : null}
        {error ? <p>{error}</p> : null}
      </form>
    </div>
  );
}
