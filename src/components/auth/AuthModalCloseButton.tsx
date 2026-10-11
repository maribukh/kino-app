"use client";

interface AuthModalCloseButtonProps {
  onClose: () => void;
}

export const AuthModalCloseButton = ({
  onClose,
}: AuthModalCloseButtonProps) => {
  return (
    <button
      onClick={onClose}
      className="absolute top-6 right-6 text-text-primary hover:text-text-primary transition-colors text-lg cursor-pointer"
      aria-label="Close modal"
    >
      ✕
    </button>
  );
};
