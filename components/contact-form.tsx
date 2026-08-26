"use client";

import { FormEvent, useState } from "react";

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
    <form className="contact-form" onSubmit={submit} aria-busy={status === "loading"}>
      <label>{isAr ? "الاسم" : "Name"}<input name="name" required maxLength={120} autoComplete="name" /></label>
      <label>{isAr ? "البريد الإلكتروني" : "Email"}<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
      <label>{isAr ? "رسالتك" : "Your message"}<textarea name="message" required maxLength={5000} /></label>
      <button type="submit" disabled={status === "loading"} aria-disabled={status === "loading"}>
        {status === "loading" ? "…" : isAr ? "إرسال الرسالة" : "Send message"}
      </button>
      {status === "success" && <p className="form-success" role="status" aria-live="polite">{isAr ? "تم استلام رسالتك." : "Your message has been received."}</p>}
      {status === "error" && <p className="form-error" role="alert">{isAr ? "تعذر الإرسال. حاول مرة أخرى." : "Something went wrong. Try again."}</p>}
    </form>
  );
}
