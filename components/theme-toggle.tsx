"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle({ label }: { label: string }) {
  const { theme, toggle } = useTheme();
  return <button className="icon-button theme-toggle" type="button" onClick={toggle} aria-label={`${label}: ${theme === "dark" ? "light" : "dark"}`} title={label}>
    <span aria-hidden="true">{theme === "dark" ? "☼" : "◐"}</span>
  </button>;
}
