import * as React from "react";
import { cn } from "@/lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-sans font-medium text-parchment-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full rounded-sm px-3.5 text-sm font-sans",
            "bg-parchment-100 border border-parchment-400",
            "dark:border-[#5a4030]",
            "text-parchment-950 placeholder:text-parchment-400",
            "transition-all duration-150",
            "focus:outline-none focus:border-sienna-600 focus:bg-parchment-50",
            error && "border-rose-400 focus:border-rose-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs font-sans text-rose-600">{error}</p>}
        {hint && !error && <p className="text-xs font-sans text-parchment-500">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
