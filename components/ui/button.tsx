import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "slide-button",
  {
    variants: {
      variant: {
        default: "slide-button--primary",
        outline: "slide-button--outline",
        ghost: "slide-button--ghost",
        link: "slide-button--link",
      },
      size: { default: "slide-button--default", sm: "slide-button--sm", lg: "slide-button--lg", icon: "slide-button--icon" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  if (asChild) return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>{children}</Comp>;
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
    <span className="slide-button__content">
      <span>{children}</span>
      <svg className="slide-button__arrow" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 7h10v10" />
        <path d="M7 17 17 7" />
      </svg>
    </span>
  </Comp>;
});
Button.displayName = "Button";
export { Button, buttonVariants };
