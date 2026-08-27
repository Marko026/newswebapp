"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactForm({ locale }: { locale: "ar" | "en" }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const isAr = locale === "ar";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("loading");
    const formData = new FormData(form);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { "content-type": "application/json" },
      });
      if (!response.ok) throw new Error("contact request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="contact-form" onSubmit={submit} aria-busy={status === "loading"} data-state={status}>
      <Label>{isAr ? "الاسم" : "Name"}<Input name="name" required maxLength={120} autoComplete="name" /></Label>
      <Label>{isAr ? "البريد الإلكتروني" : "Email"}<Input name="email" type="email" required maxLength={254} autoComplete="email" /></Label>
      <Label>{isAr ? "رسالتك" : "Your message"}<Textarea name="message" required maxLength={5000} /></Label>
      <Button type="submit" disabled={status === "loading"} aria-disabled={status === "loading"}>
        {status === "loading" ? "…" : isAr ? "إرسال الرسالة" : "Send message"}
      </Button>
      {status === "success" && <p className="form-success" role="status" aria-live="polite">{isAr ? "تم استلام رسالتك." : "Your message has been received."}</p>}
      {status === "error" && <p className="form-error" role="alert">{isAr ? "تعذر الإرسال. حاول مرة أخرى." : "Something went wrong. Try again."}</p>}
    </form>
  );
}
