import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "secondary-dark" | "ghost";
export type ButtonSize = "md" | "lg";

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  extra?: string,
) {
  return cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-semibold transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-60",
    size === "lg" ? "px-7 py-3 text-base sm:text-lg" : "px-5 py-2.5 text-[0.95rem]",
    variant === "primary" && "bg-green text-white shadow-sm hover:bg-green-dark",
    variant === "secondary" && "border-2 border-navy text-navy hover:bg-navy hover:text-white",
    variant === "secondary-dark" &&
      "border-2 border-white/80 text-white hover:bg-white hover:text-navy",
    variant === "ghost" && "text-blue-strong hover:bg-blue-soft",
    extra,
  );
}

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
};

type ButtonAsLink = CommonProps & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "className"
  >;
type ButtonAsButton = CommonProps & { href?: undefined } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "className"
  >;

export function Button(props: ButtonAsLink | ButtonAsButton) {
  if (props.href !== undefined) {
    const { variant, size, className, children, href, ...rest } = props;
    const cls = buttonClasses(variant, size, className);
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return (
        <a href={href} className={cls} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  const { variant, size, className, children, type = "button", ...rest } = props;
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
