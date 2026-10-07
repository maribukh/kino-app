import { ReactNode } from "react";

interface InputStatusProps {
  isValid?: boolean;
  error?: string;
  endIcon?: ReactNode;
}

export const InputStatus = ({ isValid, error, endIcon }: InputStatusProps) => {
  if (endIcon) {
    return (
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 flex items-center justify-center z-10">
        {endIcon}
      </div>
    );
  }

  if (isValid) {
    return (
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#00C853] pointer-events-none">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M13.3332 4L5.99984 11.3333L2.6665 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#EC3013] pointer-events-none">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8 5V8.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
        </svg>
      </div>
    );
  }

  return null;
};
