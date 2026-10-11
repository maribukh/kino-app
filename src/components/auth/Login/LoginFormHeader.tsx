"use client";

import { CloseButton } from "@/components/ui/CloseButton";

interface LoginFormHeaderProps {
  onClose: () => void;
}

export const LoginFormHeader = ({ onClose }: LoginFormHeaderProps) => {
  return (
    <div className="flex items-top justify-between mb-5">
      <div>
        <h2 className="text-h1 font-bold text-text-primary">Log in</h2>
        <p className="text-text-secondary text-body-s mt-0.5">
          Welcome back to Kino XII
        </p>
      </div>
      <CloseButton onClose={onClose} />
    </div>
  );
};
