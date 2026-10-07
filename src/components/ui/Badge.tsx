import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "accent" | "neutral" | "danger";
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
    accent: "bg-[#EC3013]/20 text-[12px] font-bold text-[#EC3013]",
    neutral: "bg-white/10 text-white",
    danger: "bg-[#EC3013] font-[12px] text-bold",
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
