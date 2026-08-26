"use client";

import { FormEvent, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormStatus = "idle" | "loading" | "success" | "error";

export function NewsletterForm({ locale }: { locale: "ar" | "en" }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [email, setEmail] = useState("");
  const emailId = useId();
  const isAr = locale === "ar";

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      if (!response.ok) throw new Error("newsletter request failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="newsletter-form" onSubmit={submit} aria-busy={status === "loading"}>
      <Label htmlFor={emailId}>{isAr ? "بريدك الإلكتروني" : "Your email"}</Label>
      <div>
        <Input id={emailId} name="email" type="email" required maxLength={254} autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={isAr ? "you@example.com" : "you@example.com"} dir="ltr" />
        <Button type="submit" disabled={status === "loading"} aria-disabled={status === "loading"}>{status === "loading" ? "…" : isAr ? "اشترك" : "Subscribe"}</Button>
      </div>
      {status === "success" && <p className="form-success" role="status" aria-live="polite">{isAr ? "تم تسجيل طلبك." : "Your request has been received."}</p>}
      {status === "error" && <p className="form-error" role="alert">{isAr ? "تعذر الإرسال. حاول مرة أخرى." : "Something went wrong. Try again."}</p>}
    </form>
  );
}
