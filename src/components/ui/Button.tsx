import React from "react";
import Link from "next/link";

const VARIANTS = {
  primary:
    "group relative w-full sm:w-auto bg-white text-black border-white hover:bg-gray-200 px-8 py-4 shadow-[4px_4px_0px_0px_#64748b]",
  secondary:
    "bg-black text-neutral-500 border-neutral-500 hover:border-slate-500 hover:text-white hover:shadow-[4px_4px_0px_0px_#64748b] shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] px-6 py-2",
};

const BASE_STYLES =
  "inline-flex items-center justify-center gap-3 border-2 font-bold uppercase tracking-wider transition-all active:translate-y-1 active:shadow-none rounded-none cursor-pointer no-underline disabled:opacity-50 disabled:pointer-events-none";

type ButtonVariant = keyof typeof VARIANTS;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export const Button = ({
  variant = "primary",
  href,
  className = "",
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) => {

  const combinedClassName = `${BASE_STYLES} ${VARIANTS[variant]} ${className}`;

  if (href) {
    const isExternal = href.startsWith("http");

    if (isExternal) {
      return (
        <a
          href={href}
          className={combinedClassName}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={combinedClassName}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};