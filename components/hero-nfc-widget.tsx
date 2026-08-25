"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Car, 
  UtensilsCrossed, 
  Wallet, 
  IdCard
} from "lucide-react";

interface OrbButtonProps {
  href: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  positionClass: string;
  floatAnimationClass: string;
}

function OrbButton({
  href,
  title,
  subtitle,
  icon,
  positionClass,
  floatAnimationClass,
}: OrbButtonProps) {
  return (
    <Link
      href={href}
      className={`group absolute z-20 flex flex-col items-center justify-center transition-all duration-300 ${positionClass} ${floatAnimationClass}`}
      style={{ willChange: "transform" }}
    >
      {/* 3D Glass Bubble Container */}
      <div className="relative flex size-24 sm:size-28 md:size-32 flex-col items-center justify-center rounded-full border border-white/95 bg-gradient-to-b from-white/70 via-white/45 to-sky-50/40 p-2 shadow-[0_10px_25px_rgba(15,23,42,0.06),inset_0_3px_8px_rgba(255,255,255,0.95),inset_0_-3px_8px_rgba(255,255,255,0.5)] backdrop-blur-xl transition-all duration-300 group-hover:scale-105 group-hover:bg-white/80 group-hover:border-white group-hover:shadow-[0_14px_30px_rgba(15,23,42,0.09),inset_0_3px_10px_rgba(255,255,255,1)]">
        
        {/* Specular High-Gloss Glare Crescent */}
        <div className="pointer-events-none absolute left-3.5 top-2.5 size-7 sm:size-8 rounded-full bg-gradient-to-br from-white/95 via-white/40 to-transparent blur-[0.5px]" />
        
        {/* Soft Secondary Edge Reflection */}
        <div className="pointer-events-none absolute right-3 bottom-3 size-4 rounded-full bg-white/40 blur-[1px]" />

        {/* Icon Pill with Premium Gradient */}
        <div className="relative flex size-9 sm:size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29AEEE] to-[#0284C7] text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>

        {/* Title Label */}
        <span className="mt-1.5 px-1 text-center text-[10px] sm:text-[11px] font-black uppercase tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-sky-600">
          {title}
        </span>
        {subtitle && (
          <span className="hidden sm:block text-[9px] font-medium text-slate-500">
            {subtitle}
          </span>
        )}
      </div>
    </Link>
  );
}

export default function HeroNfcWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 12, y: -y * 12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto flex w-full max-w-[500px] sm:max-w-[560px] lg:max-w-[580px] select-none items-center justify-center py-10 sm:py-14"
      style={{ perspective: 1000 }}
    >
      {/* Background Soft Glow Aura */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="size-[320px] sm:size-[420px] rounded-full bg-gradient-to-tr from-sky-400/15 via-sky-200/20 to-indigo-200/10 blur-3xl" />
      </div>

      {/* 4 FLOATING BUBBLE ORB BUTTONS */}
      {/* 1. TOP LEFT: ZIA VİZİTKART */}
      <OrbButton
        href="/vizitkart"
        title="Zia Vizitkart"
        icon={<IdCard className="size-5 sm:size-6" />}
        positionClass="-top-3 -left-3 sm:-top-4 sm:left-0"
        floatAnimationClass="animate-[floatOrb1_5s_ease-in-out_infinite]"
      />

      {/* 2. TOP RIGHT: ZIA PAY */}
      <OrbButton
        href="/pay"
        title="Zia Pay"
        icon={<Wallet className="size-5 sm:size-6" />}
        positionClass="-top-3 -right-3 sm:-top-4 sm:right-0"
        floatAnimationClass="animate-[floatOrb2_5.5s_ease-in-out_infinite]"
      />

      {/* 3. BOTTOM LEFT: ZIA MENU */}
      <OrbButton
        href="/menu"
        title="Zia Menu"
        icon={<UtensilsCrossed className="size-5 sm:size-6" />}
        positionClass="-bottom-3 -left-3 sm:-bottom-4 sm:left-0"
        floatAnimationClass="animate-[floatOrb3_6s_ease-in-out_infinite]"
      />

      {/* 4. BOTTOM RIGHT: ZIA CAR */}
      <OrbButton
        href="/car"
        title="Zia Car"
        icon={<Car className="size-5 sm:size-6" />}
        positionClass="-bottom-3 -right-3 sm:-bottom-4 sm:right-0"
        floatAnimationClass="animate-[floatOrb4_5.2s_ease-in-out_infinite]"
      />

      {/* CENTRAL LUXURY 3D SMART CARD */}
      <div
        className="relative z-10 flex min-h-[320px] sm:min-h-[360px] lg:min-h-[390px] w-[225px] sm:w-[260px] md:w-[280px] lg:w-[295px] flex-col justify-between rounded-[34px] sm:rounded-[38px] border border-white/95 bg-gradient-to-b from-white/95 via-white/88 to-sky-50/85 p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.12),0_10px_25px_rgba(41,174,238,0.1),0_0_0_1px_rgba(255,255,255,0.9),inset_0_2px_8px_rgba(255,255,255,1),inset_0_-6px_16px_rgba(41,174,238,0.06)] backdrop-blur-2xl transition-transform duration-300 ease-out"
        style={{
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Holographic Specular Diagonal Sheen */}
        <div className="pointer-events-none absolute inset-0 rounded-[34px] sm:rounded-[38px] bg-gradient-to-tr from-transparent via-white/35 to-sky-100/30 opacity-80" />

        {/* Card Header & Brand Identity */}
        <div className="relative flex flex-1 flex-col items-center justify-center text-center py-6 sm:py-8">
          {/* Logo Badge in Frosted Glass Container */}
          <div className="relative mb-5 flex size-18 sm:size-20 items-center justify-center rounded-2xl bg-white/95 p-2 shadow-[0_10px_25px_rgba(15,23,42,0.08)] ring-4 ring-white/90">
            <Image
              src="/logo.webp"
              alt="Zia NFC"
              width={80}
              height={80}
              priority
              className="size-full rounded-xl object-cover"
            />
          </div>

          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
            Zia <span className="text-sky-500">NFC</span>
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm font-bold text-slate-600">
            Ağıllı Rəqəmsal Platforma
          </p>
        </div>
      </div>
    </div>
  );
}
