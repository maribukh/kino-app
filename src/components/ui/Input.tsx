import { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  wrapperClassName?: string;
}

export const Input = ({
  icon,
  className = "",
  wrapperClassName = "",
  ...props
}: InputProps) => {
  return (
    <div className={`relative w-full ${wrapperClassName}`}>
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white flex items-center justify-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        className={`w-full h-11 bg-white/10 rounded-full text-[14px] text-white placeholder:text-white focus:outline-none hover:border-[#A9A9A9] transition-all ${
          icon ? "pl-11 pr-4" : "px-4"
        } ${className}`}
        {...props}
      />
    </div>
  );
};
