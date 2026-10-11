import Image from "next/image";
import { Button } from "../ui/Button";
import { HeroControlsProps } from "@/types/movie";

export const HeroControls = ({
  total,
  currentIndex,
  onSelect,
  onPrev,
  onNext,
}: HeroControlsProps) => {
  return (
    <div className="relative z-10 max-w-[1920px] w-full mx-auto px-16.75">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 w-[88%]">
          {Array.from({ length: total }).map((_, idx) => (
            <div
              key={idx}
              onClick={() => onSelect(idx)}
              className={`h-0.75 flex-1 rounded-full cursor-pointer transition-all ${
                idx === currentIndex
                  ? "bg-[#EC3013]"
                  : "bg-white hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="icon" onClick={onPrev}>
            <Image
              src="/images/icons/arrow-left-01-round.svg"
              alt="arrow left"
              width={34}
              height={34}
            />
          </Button>

          <Button variant="icon" onClick={onNext}>
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
  );
};
