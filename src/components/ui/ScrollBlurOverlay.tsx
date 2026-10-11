interface ScrollBlurOverlayProps {
  className?: string;
}

export const ScrollBlurOverlay = ({
  className = "",
}: ScrollBlurOverlayProps) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-[70px] overflow-hidden ${className}`}
    >
      <div className="absolute right-[-20px] top-0 bottom-0 w-[60px] bg-[#070C1C] blur-[24px] opacity-95" />

      <div className="absolute inset-0 bg-gradient-to-l from-[#070C1C] via-[#070C1C]/80 to-transparent" />
    </div>
  );
};
