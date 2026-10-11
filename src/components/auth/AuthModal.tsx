"use client";

import { useAuthModalState } from "@/hooks/useAuthModalState";
import { LoginForm } from "./Login/LoginForm";
import { SignUpForm } from "./Sign Up/SignUpForm";

export const AuthModal = () => {
  const {
    modalMode,
    closeAuthModal,
    handleSwitchToSignUp,
    handleSwitchToLogin,
  } = useAuthModalState();

  if (!modalMode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={closeAuthModal}
        className="fixed inset-0 bg-[#070C1C]/10 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[403px] bg-bg-page border border-overlay-border rounded-[28px] p-7 z-10 text-text-primary shadow-2xl animate-in zoom-in-95 duration-200">
        {modalMode === "login" ? (
          <LoginForm
            onSwitchToSignUp={handleSwitchToSignUp}
            onClose={closeAuthModal}
          />
        ) : (
          <SignUpForm
            onSwitchToLogin={handleSwitchToLogin}
            onClose={closeAuthModal}
          />
        )}
      </div>
    </div>
  );
};
