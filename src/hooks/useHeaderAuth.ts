"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export const useHeaderAuth = () => {
  const { user, isAuthenticated, openLoginModal, openSignUpModal, logout } =
    useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return {
    user,
    isAuthenticated,
    isMenuOpen,
    toggleMenu,
    closeMenu,
    openLoginModal,
    openSignUpModal,
    handleLogout,
  };
};
