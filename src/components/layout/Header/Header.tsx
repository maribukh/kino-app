"use client";

import Link from "next/link";
import { useHeaderAuth } from "@/hooks/useHeaderAuth";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderAuthButtons } from "./HeaderAuthButtons";
import { HeaderUserMenu } from "./HeaderUserMenu";

export const Header = () => {
  const {
    user,
    isAuthenticated,
    isMenuOpen,
    toggleMenu,
    closeMenu,
    openLoginModal,
    openSignUpModal,
    handleLogout,
  } = useHeaderAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-b from-black via-black/50 to-transparent">
      <div className="max-w-[1920px] mx-auto px-15 h-28 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="text-[20px] font-black tracking-wider text-white uppercase flex items-center gap-1"
          >
            KINO <span className="text-[#EC3013]">XII</span>
          </Link>

          <nav className="flex items-center">
            <Link
              href="/sessions"
              className="text-[12px] font-semibold text-white tracking-widest hover:text-[#EC3013] transition-colors uppercase"
            >
              SESSIONS
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-9">
          <HeaderSearch />

          {isAuthenticated && user ? (
            <HeaderUserMenu
              user={user}
              isMenuOpen={isMenuOpen}
              onToggle={toggleMenu}
              onClose={closeMenu}
              onLogout={handleLogout}
            />
          ) : (
            <HeaderAuthButtons
              onSignUp={openSignUpModal}
              onLogIn={() => openLoginModal()}
            />
          )}
        </div>
      </div>
    </header>
  );
};
