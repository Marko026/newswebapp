/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--color-paper)",
        "paper-raised": "var(--color-paper-raised)",
        ink: "var(--color-ink)",
        muted: "var(--color-muted)",
        rule: "var(--color-line)",
        accent: "var(--color-accent)",
        "accent-ink": "var(--color-accent-ink)",
        focus: "var(--color-focus)",
        error: "var(--color-error)",
        success: "var(--color-success)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        mono: "var(--font-mono)",
        arabic: "var(--font-arabic)",
      },
    },
  },
};

export default config;
