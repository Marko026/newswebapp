"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="admin-recovery">
      <h1>Admin panel trenutno nije dostupan</h1>
      <p>
        Payload CMS ne može da se poveže sa PostgreSQL bazom. Pokreni bazu, pa pokušaj ponovo.
      </p>
      <pre>
        docker compose up -d postgres
      </pre>
      <button type="button" onClick={reset}>
        Pokušaj ponovo
      </button>
    </main>
  );
}
