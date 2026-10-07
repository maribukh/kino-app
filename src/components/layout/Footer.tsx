import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#070C1C] py-8 mt-auto">
      <div className="max-w-[1920px] mx-auto px-16.75">
        <div className="w-full border-t border-white/10 pt-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[18px] font-black tracking-wide"
          >
            <span className="text-white">KINO</span>
            <span className="text-[#EC3013]">XII</span>
          </Link>

          <p className="text-[12px] text-white/40 font-normal">
            © {new Date().getFullYear()} Kino XII. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
