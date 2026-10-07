"use client";

import Image from "next/image";
import { Input } from "../../ui/Input";

export const HeaderSearch = () => {
  return (
    <Input
      icon={
        <Image
          src="/images/icons/search.svg"
          alt="search"
          width={15}
          height={15}
        />
      }
      placeholder="Search films and live events"
      wrapperClassName="w-[320px] lg:w-[380px]"
      className="h-[41px] bg-white/10 border-none rounded-full text-[13px] text-white placeholder:text-white focus:bg-white/15 focus:ring-0 hover:border-none"
    />
  );
};
