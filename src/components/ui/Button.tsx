import { ButtonProps } from "@/types/button";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "font-bold transition-all flex items-center justify-center cursor-pointer whitespace-nowrap";

  const variants = {
    primary:
      "bg-color-red text-text-primary hover:opacity-90 disabled:bg-[#505261] disabled:text-text-secondary disabled:cursor-not-allowed disabled:hover:opacity-100",
    secondary:
      "bg-text-primary text-bg-page hover:bg-text-primary/90 disabled:bg-[#505261] disabled:text-text-secondary disabled:cursor-not-allowed",
    ghost:
      "text-text-primary border border-overlay-border hover:bg-tint-white bg-transparent disabled:opacity-50 disabled:cursor-not-allowed",
    icon: "bg-black/30 text-text-primary hover:bg-black/80 backdrop-blur-sm p-0 rounded-full disabled:opacity-50 disabled:cursor-not-allowed",
  };

  const sizes = {
    sm: "h-8 px-4 text-label-s rounded-full",
    md: "h-[41px] px-5 text-button rounded-full",
    lg: "h-12 px-6 text-button rounded-full",
    custom: "",
  };

  const iconSize = variant === "icon" ? "w-[54px] h-[54px]" : "";

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${
        variant !== "icon" ? sizes[size] : iconSize
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
