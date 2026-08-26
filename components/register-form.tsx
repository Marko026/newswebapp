"use client";

import { FormEvent, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormStatus = "idle" | "loading" | "success" | "error";

export function RegisterForm({ locale }: { locale: "ar" | "en" }) {
  const arabic = locale === "ar";
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/register", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || (arabic ? "تعذر إرسال الطلب" : "We could not send your request."));
      setStatus("success");
      setMessage(arabic ? "تم إرسال طلبك للمراجعة." : "Your request is now with the editorial desk.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : (arabic ? "تعذر إرسال الطلب" : "We could not send your request."));
    }
  }

  const isLoading = status === "loading";
  return <form className="access-request-form" onSubmit={submit} aria-busy={isLoading}>
    <div className="form-intro-row">
      <span className="form-step">01 / 03</span>
      <p>{arabic ? "بياناتك الأساسية" : "Your details"}</p>
    </div>
    <Label htmlFor={nameId}>{arabic ? "الاسم الكامل" : "Full name"}<Input id={nameId} name="name" required maxLength={120} autoComplete="name" /></Label>
    <Label htmlFor={emailId}>{arabic ? "البريد الإلكتروني" : "Email address"}<Input id={emailId} name="email" type="email" required maxLength={254} autoComplete="email" /></Label>
    <div className="form-field-note">{arabic ? "ستستخدم هذا البريد لتسجيل الدخول بعد الموافقة." : "We’ll use this email for sign-in once your request is approved."}</div>
    <Label htmlFor={passwordId}>{arabic ? "كلمة المرور" : "Password"}<Input id={passwordId} name="password" type="password" minLength={12} required autoComplete="new-password" aria-describedby={`${passwordId}-hint`} /></Label>
    <div id={`${passwordId}-hint`} className="form-field-note">{arabic ? "12 حرفاً على الأقل." : "At least 12 characters."}</div>
    <Button className="access-request-submit" type="submit" disabled={isLoading} aria-disabled={isLoading}>
      <span>{isLoading ? (arabic ? "جاري الإرسال" : "Sending request") : arabic ? "إرسال طلب الوصول" : "Request access"}</span>
      {isLoading && <span className="form-spinner" aria-hidden="true" />}
    </Button>
    {message && <p className={status === "error" ? "form-error" : "form-success"} role={status === "error" ? "alert" : "status"} aria-live="polite">{message}</p>}
  </form>;
}
