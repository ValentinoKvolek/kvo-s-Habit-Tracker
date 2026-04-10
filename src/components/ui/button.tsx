import * as React from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant =
  | "default"
  | "outline"
  | "ghost"
  | "danger"
  | "brand";

type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  default:
    "bg-parchment-300 text-parchment-800 hover:bg-parchment-400 border border-parchment-400",
  outline:
    "border border-parchment-400 text-parchment-700 hover:bg-parchment-200 bg-transparent",
  ghost:
    "text-parchment-600 hover:text-parchment-950 hover:bg-parchment-200 bg-transparent",
  danger:
    "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200",
  brand:
    "bg-parchment-950 text-parchment-100 hover:bg-sienna-800 shadow-sm",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm:   "h-8 px-3 text-xs rounded-sm",
  md:   "h-10 px-4 text-sm rounded-sm",
  lg:   "h-11 px-6 text-sm rounded-sm",
  icon: "h-10 w-10 rounded-sm",
};

export function Button({
  variant = "default",
  size = "md",
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-sans font-medium",
        "transition-all duration-150 cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "active:scale-[0.97]",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
