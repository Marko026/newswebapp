import { notFound } from "next/navigation";
import { RegisterForm } from "@/components/register-form";

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "ar" && locale !== "en") notFound();
  const arabic = locale === "ar";
  return <main className="page-wrap subpage access-request-page" dir={arabic ? "rtl" : "ltr"}>
    <div className="access-request-grid">
    <div className="subpage-heading">
      <p className="eyebrow">{arabic ? "الوصول إلى الإدارة" : "Admin access"}</p>
      <h1>{arabic ? "انضم إلى غرفة الأخبار" : "Join the newsroom"}</h1>
      <p className="subpage-lede">{arabic ? "كل حساب بعد حساب المالك يحتاج إلى موافقة المالك." : "Every account after the owner must be approved by the owner."}</p>
    </div>
    <div className="register-form-shell"><RegisterForm locale={locale} /><p className="form-note">{arabic ? "بعد الإرسال، يراجع المالك طلبك. ستتمكن من تسجيل الدخول من /admin بعد الموافقة." : "After sending, an owner reviews your request. Once approved, sign in at /admin."}</p></div>
    </div>
  </main>;
}
