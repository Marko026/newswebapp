"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main style={{ maxWidth: 720, margin: "4rem auto", padding: "0 1.5rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Admin panel trenutno nije dostupan</h1>
      <p>
        Payload CMS ne može da se poveže sa PostgreSQL bazom. Pokreni bazu, pa pokušaj ponovo.
      </p>
      <pre style={{ overflowX: "auto", padding: "1rem", background: "#f3f3f3", borderRadius: 8 }}>
        docker compose up -d postgres
      </pre>
      <button type="button" onClick={reset} style={{ padding: "0.7rem 1rem", cursor: "pointer" }}>
        Pokušaj ponovo
      </button>
    </main>
  );
}
