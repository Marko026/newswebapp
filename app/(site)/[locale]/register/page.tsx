import { notFound } from "next/navigation";
import { RegisterForm } from "@/components/register-form";

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "ar" && locale !== "en") notFound();
  const arabic = locale === "ar";
  return <main className="page-wrap subpage access-request-page" dir={arabic ? "rtl" : "ltr"}>
    <div className="subpage-heading">
      <p className="eyebrow">{arabic ? "Pristup adminu" : "Admin access"}</p>
      <h1>{arabic ? "التسجيل" : "Register"}</h1>
      <p className="subpage-lede">{arabic ? "كل حساب بعد حساب المالك يحتاج إلى موافقة المالك." : "Every account after the owner must be approved by the owner."}</p>
    </div>
    <div className="register-form-shell"><RegisterForm locale={locale} /><p className="form-note">{arabic ? "Nakon slanja, vlasnik pregleda zahtev. Povratak za prijavu: /admin." : "After submitting, an owner reviews your request. Return to /admin to sign in once approved."}</p></div>
  </main>;
}
