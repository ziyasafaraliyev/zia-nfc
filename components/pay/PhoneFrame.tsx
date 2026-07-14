import { cn } from "@/lib/utils";

type PhoneFrameProps = {
  children: React.ReactNode;
  className?: string;
  /** Slightly smaller on mobile if needed */
  size?: "md" | "lg";
};

/**
 * Clean iPhone-style frame — eyni quruluş zia-nfc HeroMockup telefonu ilə.
 * Fixed width/height, proper overflow, notch + home indicator.
 */
export default function PhoneFrame({
  children,
  className,
  size = "lg",
}: PhoneFrameProps) {
  return (
    <div
      className={cn(
        "relative mx-auto shrink-0",
        size === "lg"
          ? "h-[540px] w-[270px] sm:h-[575px] sm:w-[292px]"
          : "h-[480px] w-[250px] sm:h-[520px] sm:w-[270px]",
        className
      )}
    >
      <div className="h-full w-full rounded-[2.4rem] border-[8px] border-slate-950 bg-slate-950 shadow-[0_40px_110px_rgba(15,23,42,0.28)]">
        <div className="relative h-full w-full overflow-hidden rounded-[1.85rem] bg-slate-50">
          {/* Dynamic Island / notch */}
          <div
            className="pointer-events-none absolute left-1/2 top-2.5 z-30 h-[18px] w-[78px] -translate-x-1/2 rounded-full bg-slate-950 sm:w-20"
            aria-hidden
          />
          {/* Screen content */}
          <div className="absolute inset-0 z-10 flex flex-col overflow-hidden">
            {children}
          </div>
          {/* Home indicator */}
          <div
            className="pointer-events-none absolute bottom-2 left-1/2 z-30 h-1 w-[100px] -translate-x-1/2 rounded-full bg-slate-950/25"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}

/** iOS status bar strip under the notch */
export function PhoneStatusBar({ dark = false }: { dark?: boolean }) {
  const color = dark ? "text-white" : "text-slate-950";
  const fill = dark ? "#fff" : "#0f172a";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-between px-5 pb-1 pt-8",
        color
      )}
    >
      <span className="text-[11px] font-semibold tracking-tight">9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="15" height="10" viewBox="0 0 16 11" fill="none" aria-hidden>
          <rect x="0" y="7" width="3" height="4" rx="0.6" fill={fill} />
          <rect x="4.2" y="5" width="3" height="6" rx="0.6" fill={fill} />
          <rect x="8.4" y="2.5" width="3" height="8.5" rx="0.6" fill={fill} />
          <rect
            x="12.6"
            y="0"
            width="3"
            height="11"
            rx="0.6"
            fill={fill}
            opacity="0.35"
          />
        </svg>
        <svg width="14" height="10" viewBox="0 0 15 11" fill="none" aria-hidden>
          <path
            d="M7.5 10.2a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z"
            fill={fill}
          />
          <path
            d="M4.2 7.2a4.6 4.6 0 0 1 6.6 0"
            stroke={fill}
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M1.8 4.8a7.8 7.8 0 0 1 11.4 0"
            stroke={fill}
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
        <div className="flex items-center gap-0.5">
          <div
            className={cn(
              "relative h-[10px] w-[20px] rounded-[3px] border p-[1.5px]",
              dark ? "border-white/80" : "border-slate-950/80"
            )}
          >
            <div
              className={cn(
                "h-full w-[80%] rounded-[1.5px]",
                dark ? "bg-white" : "bg-slate-950"
              )}
            />
          </div>
          <div
            className={cn(
              "h-[4px] w-[1.5px] rounded-r-full",
              dark ? "bg-white/50" : "bg-slate-950/50"
            )}
          />
        </div>
      </div>
    </div>
  );
}
