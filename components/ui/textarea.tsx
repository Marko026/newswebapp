import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(({ className, ...props }, ref) => <textarea className={cn("flex min-h-32 w-full rounded-none border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-3 text-base text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] disabled:cursor-not-allowed disabled:opacity-50", className)} ref={ref} {...props} />);
Textarea.displayName = "Textarea";
export { Textarea };
