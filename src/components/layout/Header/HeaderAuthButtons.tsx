"use client";

import { Button } from "@/components/ui/Button";
interface HeaderAuthButtonsProps {
  onSignUp: () => void;
  onLogIn: () => void;
}

export const HeaderAuthButtons = ({
  onSignUp,
  onLogIn,
}: HeaderAuthButtonsProps) => {
  return (
    <div className="flex items-center gap-2.5">
      <Button onClick={onSignUp} variant="primary" size="md">
        Sign up
      </Button>
      <Button onClick={onLogIn} variant="secondary" size="md">
        Log in
      </Button>
    </div>
  );
};
