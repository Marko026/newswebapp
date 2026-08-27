import Link from "next/link";

export function RequestAccess() {
  return <div className="payload-request-access">
    <p>Need an editorial account? Register and wait for owner approval.</p>
    <Link href="/en/register">Register</Link>
    <span aria-hidden="true"> · </span>
    <Link href="/admin">Admin sign in</Link>
    <span aria-hidden="true"> · </span>
    <Link href="/ar/register" lang="ar" dir="rtl">التسجيل</Link>
    {process.env.GOOGLE_OIDC_CLIENT_ID && <>
      <span aria-hidden="true"> · </span>
      <Link href="/api/auth/google/start">Continue with Google</Link>
    </>}
  </div>;
}
