interface InputLabelProps {
  label?: string;
  hasError?: boolean;
}

export const InputLabel = ({ label, hasError }: InputLabelProps) => {
  if (!label) return null;

  return (
    <label
      className={`block text-[12px] font-medium mb-1 transition-colors ${
        hasError ? "text-[#EC3013]" : "text-white/80"
      }`}
    >
      {label}
    </label>
  );
};
