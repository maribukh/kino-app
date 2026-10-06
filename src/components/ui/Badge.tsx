import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "accent" | "neutral";
  className?: string;
}

export const Badge = ({
  children,
  variant = "neutral",
  className = "",
}: BadgeProps) => {
  const base =
    "inline-block text-[12px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider";

  const variants = {
    accent: "bg-[#EC3013]/20 border border-[#EC3013]/40 text-[#EC3013]",
    neutral: "bg-white/10 text-white",
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
