import { InputHTMLAttributes, ReactNode } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isValid?: boolean;
  icon?: ReactNode;
  endIcon?: ReactNode;
  wrapperClassName?: string;
}
