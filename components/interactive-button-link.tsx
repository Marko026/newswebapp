import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type InteractiveButtonLinkProps = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children"> & {
  children: ReactNode;
  className?: string;
  label?: string;
};

export function InteractiveButtonLink({ children, className, label, ...props }: InteractiveButtonLinkProps) {
  return <Link {...props} className={cn("slide-button", className)} aria-label={label}>
      <span className="slide-button__content">
        <span>{children}</span>
        <svg className="slide-button__arrow" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 7h10v10" />
          <path d="M7 17 17 7" />
        </svg>
      </span>
  </Link>;
}
