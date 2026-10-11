"use client";

import { CloseButton } from "@/components/ui/CloseButton";

interface SignUpFormHeaderProps {
  onClose: () => void;
}

export const SignUpFormHeader = ({ onClose }: SignUpFormHeaderProps) => {
  return (
    <div className="flex items-topg justify-between mb-6">
      <div>
        <h2 className="text-h1 font-bold text-text-primary">Sign up</h2>
        <p className="text-text-secondary text-body-s mt-0.5">
          Welcome to Kino XII
        </p>
      </div>
      <CloseButton onClose={onClose} />
    </div>
  );
};
