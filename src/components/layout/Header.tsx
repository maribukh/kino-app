import Link from "next/link";
import Image from "next/image";

export const Header = () => {
  return (
    <header className="w-full bg-[#070C1C]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto px-12 h-28 flex items-center justify-between">
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
            <input
              type="text"
              placeholder="Search films and live events"
              className="w-full h-11 pl-11 pr-4 bg-white/10 rounded-full text-[14px] text-white placeholder:text-white focus:outline-none hover:border-[#A9A9A9] transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-[#EC3013] text-white text-[14px] font-bold px-6 h-11 rounded-full hover:opacity-90 transition-opacity cursor-default">
              Sign up
            </button>

            <button className="bg-white text-[#070C1C] text-[14px] font-bold px-6 h-11 rounded-full hover:bg-white/80 transition-colors cursor-default">
              Log in
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
