"use client";

interface CloseButtonProps {
  onClose: () => void;
  className?: string;
}

export const CloseButton = ({ onClose, className = "" }: CloseButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClose}
      className={`text-text-primary text-lg font-medium cursor-pointer flex items-center justify-center w-6 h-6 rounded-full`}
      aria-label="Close"
    >
      ✕
    </button>
  );
};
