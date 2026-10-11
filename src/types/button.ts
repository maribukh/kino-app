import { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "icon" | "ghost";
  size?: "sm" | "md" | "lg" | "custom";
  className?: string;
}
