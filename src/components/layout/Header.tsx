"use client";

import Link from "next/link";
import Image from "next/image";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export const Header = () => {
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
          <div className="relative w-[380px]">
            <Image
              src="/images/icons/search.svg"
              alt="Search"
              width={14}
              height={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
            />
            <Input
              icon={
                <Image
                  src="/images/icons/search.svg"
                  alt="search"
                  width={16}
                  height={16}
                />
              }
              placeholder="Search films and live events"
              wrapperClassName="w-[380px]"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="primary">Sign up</Button>
            <Button variant="secondary">Log in</Button>
          </div>
        </div>
      </div>
    </header>
  );
};
