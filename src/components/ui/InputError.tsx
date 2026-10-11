interface InputErrorProps {
  message?: string;
}

export const InputError = ({ message }: InputErrorProps) => {
  if (!message) return null;

  return (
    <span className="text-[11px] font-medium text-[#EC3013] mt-1 block">
      {message}
    </span>
  );
};
