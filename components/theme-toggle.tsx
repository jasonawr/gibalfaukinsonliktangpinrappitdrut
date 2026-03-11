"use client";

import { useEffect } from "react";

const THEME_KEY = "gibalf_theme";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("theme-dark");
  } else {
    root.classList.remove("theme-dark");
  }
}

export function ThemeToggle() {
  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY) as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = stored || (prefersDark ? "dark" : "light");
    applyTheme(initialTheme);
  }, []);

  return (
    <button
      className="button ghost theme-toggle"
      onClick={() => {
        const isDark = document.documentElement.classList.contains("theme-dark");
        const nextTheme: Theme = isDark ? "light" : "dark";
        applyTheme(nextTheme);
        window.localStorage.setItem(THEME_KEY, nextTheme);
      }}
      type="button"
    >
      Theme
    </button>
  );
}
