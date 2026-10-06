import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/Button";

export const HeroSection = () => {
  return (
    <section className="relative w-full min-h-170 bg-[#070C1C] overflow-hidden flex flex-col justify-between pt-32 pb-12">
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/odyssey-bg.jpg"
          alt="The Odyssey"
          fill
          priority
          className="object-cover object-top opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#070C1C] via-[#070C1C]/60 to-transparent w-2/3" />
        <div className="absolute inset-0 bg-linear-to-r from-[#070C1C] via-transparent to-transparent h-1/2 bottom-0" />
      </div>

      <div className="relative z-10 max-w-[1920px] w-full mx-auto px-16.75 flex-1 flex flex-col justify-end pb-8">
        <div className="max-w-140">
          <span className="inline-block bg-[#EC3013]/20 text-[#EC3013] text-[12px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
            PREMIERE · WEEK OF 23 SEPT
          </span>

          <h1 className="text-[48px] font-black text-white uppercase tracking-tight leading-none mb-4">
            THE ODYSSEY
          </h1>

          <div className="flex items-center gap-2 mb-6 font-semibold">
            <span className="bg-[#EC3013]/20 text-[#EC3013] text-[12px] font-semibold px-2 py-0.5 rounded-full">
              12+
            </span>
            <span className="bg-white/10 text-white text-[12px] px-3 py-1 rounded-full">
              ⏱ 134 Min
            </span>
            <span className="bg-white/10 text-white text-[12px] px-3 py-1 rounded-full">
              MAX
            </span>
            <span className="bg-white/10 text-white text-[12px] px-3 py-1 rounded-full">
              PANORAMA
            </span>
          </div>

          <p className="text-white text-[14px] leading-relaxed mb-6">
            A king spends ten years finding his way home from a war he already
            won, while monsters, gods, and his own restlessness make sure the
            return takes longer than the fighting did. By the time land comes
            back into view, the man arriving is not quite the one who left.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/buy-tickets"
              className="bg-[#EC3013] text-white text-[14px] font-bold px-6 h-12 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Image
                src="/images/icons/ticket.svg"
                alt="ticket icon"
                width={16}
                height={16}
              />
              Buy tickets
            </Link>
            <Link
              href="/sessions"
              className="bg-white/10 text-white text-[14px] font-bold px-6 h-12 rounded-full hover:bg-white/70 transition-colors flex items-center justify-center"
            >
              All sessions
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-[1920px] w-full mx-auto px-16.75">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 w-[88%]">
            <div className="h-0.75 bg-[#EC3013] flex-1 rounded-full" />
            <div className="h-0.75 bg-white flex-1 rounded-full" />
            <div className="h-0.75 bg-white flex-1 rounded-full" />
            <div className="h-0.75 bg-white flex-1 rounded-full" />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="icon">
              <Image
                src="/images/icons/arrow-left-01-round.svg"
                alt="arrow left"
                width={34}
                height={34}
              />
            </Button>

            <Button variant="icon">
              <Image
                src="/images/icons/arrow-right-01-round.svg"
                alt="arrow right"
                width={34}
                height={34}
              />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
