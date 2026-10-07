"use client";

import Image from "next/image";

interface HeaderUserMenuProps {
  user: {
    username: string;
    email: string;
    avatarUrl?: string;
    isProfileComplete?: boolean;
  };
  isMenuOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onLogout: () => void;
}

export const HeaderUserMenu = ({
  user,
  isMenuOpen,
  onToggle,
  onClose,
  onLogout,
}: HeaderUserMenuProps) => {
  const initials = user.username
    ? user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "US";

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-3 px-3 py-1.5 transition-colors cursor-pointer"
      >
        <div className="relative w-8 h-8 rounded-lg bg-bg-card flex items-center justify-center font-semibold text-[12px] text-white overflow-hidden">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.username}
              fill
              className="object-cover"
            />
          ) : (
            initials
          )}
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#070C1C] ${
              user.isProfileComplete ? "bg-color-green" : "bg-color-orange"
            }`}
          />
        </div>

        <span className="text-white text-[13px] font-semibold">
          {user.username}
        </span>
        <Image
          src="/images/icons/dropdown.svg"
          alt="down icon"
          width={16}
          height={16}
        />
      </button>

      {isMenuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <div className="absolute right-0 mt-3 w-[304px] bg-bg-page border border-white/10 rounded-[24px] p-4 shadow-2xl z-50 text-white flex flex-col gap-3">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <div className="relative w-10 h-10 rounded-lg bg-bg-card flex items-center justify-center font-bold text-[14px] text-white overflow-hidden flex-shrink-0">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.username}
                    fill
                    className="object-cover"
                  />
                ) : (
                  initials
                )}
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#070C1C] ${
                    user.isProfileComplete
                      ? "bg-color-green"
                      : "bg-color-orange"
                  }`}
                />
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-bold truncate">
                  {user.username}
                </p>
                <p className="text-[11px] text-white/50 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            {user.isProfileComplete ? (
              <div className="bg-tint-green border border-color-green/20 p-3 rounded-xl flex items-center justify-between">
                <span className="text-color-green font-bold text-[12px]">
                  Profile Complete ✓
                </span>
              </div>
            ) : (
              <div className="bg-tint-warning px-[12px] py-[10px] rounded-xl">
                <p className="text-color-orange font-bold text-label-m">
                  Profile incomplete
                </p>
                <p className="text-white/60 text-label-s mt-0.5">
                  Please complete your profile to enable booking
                </p>
              </div>
            )}

            <div className="flex flex-col gap-1 text-[13px]">
              <a
                href="/profile"
                className="flex items-center gap-2 py-2 px-2 rounded-lg transition-colors text-white  hover:bg-white/8"
              >
                <Image
                  src="/images/icons/profile.svg"
                  alt="profile icon"
                  width={16}
                  height={16}
                />
                My Profile
              </a>
              <a
                href="/tickets"
                className="flex items-center gap-2.5 py-2 px-2 rounded-lg transition-colors text-white hover:bg-white/8"
              >
                <Image
                  src="/images/icons/ticket.svg"
                  alt="ticket icon"
                  width={16}
                  height={16}
                />
                My Tickets
              </a>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 py-2 px-2 hover:bg-white/8 rounded-lg transition-colors text-left text-color-red font-medium cursor-pointer"
              >
                <Image
                  src="/images/icons/logout.svg"
                  alt="ticket icon"
                  width={16}
                  height={16}
                />
                Log out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
