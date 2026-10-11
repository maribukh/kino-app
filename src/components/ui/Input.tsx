import { forwardRef } from "react";
import { InputProps } from "@/types/input";
import { InputStatus } from "./InputStatus";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      isValid,
      icon,
      endIcon,
      className = "",
      wrapperClassName = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div className={`relative w-full ${wrapperClassName}`}>
        {label && (
          <label
            className={`block text-[12px] font-medium mb-1.5 transition-colors ${
              error ? "text-color-red" : "text-text-primary/80"
            }`}
          >
            {label}
          </label>
        )}

        <div className="relative w-full flex items-center">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/60 flex items-center justify-center pointer-events-none z-10">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={`w-full h-[42px] bg-white/5 border border-white/10 rounded-full text-[14px] text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-color-red focus:bg-white/10 transition-all ${
              icon ? "pl-11" : "px-4"
            } ${endIcon || isValid || error ? "pr-10" : "pr-4"} ${
              error ? "border-color-red" : ""
            } ${className}`}
            {...props}
          />

          <InputStatus isValid={isValid} error={error} endIcon={endIcon} />
        </div>

        {error && (
          <span className="text-[12px] font-medium text-color-red mt-1 block">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
