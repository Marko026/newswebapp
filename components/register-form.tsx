"use client";

import { FormEvent, useState } from "react";

export function RegisterForm({ locale }: { locale: "ar" | "en" }) {
  const arabic = locale === "ar";
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch("/api/register", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    const body = await response.json().catch(() => ({}));
    setMessage(response.ok ? (arabic ? "تم إرسال طلبك إلى المالك للموافقة." : "Your request was sent to the owner for approval.") : (body.error || (arabic ? "فشل التسجيل" : "Registration failed")));
    if (response.ok) form.reset();
  }

  return <form className="access-request-form" onSubmit={submit}>
    <label>{arabic ? "الاسم" : "Name"}<input name="name" required maxLength={120} /></label>
    <label>{arabic ? "البريد الإلكتروني" : "Email"}<input name="email" type="email" required /></label>
    <label>{arabic ? "كلمة المرور" : "Password"}<input name="password" type="password" minLength={12} required autoComplete="new-password" /></label>
    <button type="submit">{arabic ? "إرسال طلب الوصول" : "Request access"}</button>
    {message && <p role="status">{message}</p>}
  </form>;
}
