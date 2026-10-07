import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export const useAuthModalState = () => {
  const { modalMode, closeAuthModal, openSignUpModal, openLoginModal } =
    useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSwitchToSignUp = () => {
    setError(null);
    openSignUpModal();
  };

  const handleSwitchToLogin = () => {
    setError(null);
    openLoginModal();
  };

  return {
    modalMode,
    error,
    setError,
    closeAuthModal,
    handleSwitchToSignUp,
    handleSwitchToLogin,
  };
};
