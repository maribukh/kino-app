import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isValid?: boolean;
  rightElement?: ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, isValid, rightElement, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            className={`text-[12px] font-medium ${
              error ? "text-color-red" : "text-text-secondary"
            }`}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <input
            ref={ref}
            {...props}
            className={`w-full h-[48px] px-4 pr-16 rounded-[16px] bg-[#161B2E] text-text-primary placeholder:text-text-secondary/50 text-[14px] border transition-all outline-none ${
              error
                ? "border-color-red focus:border-color-red"
                : isValid
                  ? "border-white/20 hover:border-white/40 focus:border-white/40"
                  : "border-white/10 hover:border-white/30 focus:border-white/40"
            } ${className}`}
          />

          <div className="absolute right-4 flex items-center gap-2">
            {rightElement}

            {error && (
              <svg
                className="w-5 h-5 text-color-red flex-shrink-0"
                viewBox="0 0 20 20"
                fill="none"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M10 6V11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="10" cy="14" r="1" fill="currentColor" />
              </svg>
            )}

            {!error && isValid && (
              <svg
                className="w-4 h-4 text-color-green flex-shrink-0"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M13.3333 4L6 11.3333L2.66666 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>

        {error && (
          <span className="text-[11px] text-color-red mt-0.5">{error}</span>
        )}
      </div>
    );
  },
);

AuthInput.displayName = "AuthInput";
