import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "icon" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) => {
  const baseStyles =
    "rounded-full font-bold transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#EC3013] text-white hover:opacity-90",
    secondary: "bg-white text-[#070C1C] hover:bg-white/80",
    ghost:
      "text-white font-bold border border-white/30 hover:border-white/60 hover:bg-white/5 bg-transparent",
    icon: "bg-black/30 text-white hover:bg-black/80 backdrop-blur-sm p-0",
  };

  const sizes = {
    sm: "h-9 py-1.5 px-3 text-[12px]",
    md: "h-11 px-6 text-[14px]",
    lg: "h-12 px-6 text-[14px]",
  };

  const iconSize = variant === "icon" ? "w-13.5 h-13.5 rounded-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${
        variant !== "icon" ? sizes[size] : iconSize
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
