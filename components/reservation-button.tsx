"use client";

import { useState } from "react";
import { Calendar, ExternalLink } from "lucide-react";
import ReservationModal from "./reservation-modal";

interface ReservationButtonProps {
  profileName: string;
  whatsappNumber: string;
}

export default function ReservationButton({
  profileName,
  whatsappNumber,
}: ReservationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lux-save-contact group mt-2.5 flex h-14 w-full items-center justify-between gap-3 rounded-2xl px-4 lux-card-enter-4 transition-transform duration-200 hover:scale-[1.02]"
      >
        <span className="flex items-center gap-3">
          <span className="lux-save-icon grid size-9 place-items-center rounded-xl">
            <Calendar size={16} />
          </span>
          <span className="text-sm font-bold text-gray-800">Rezervasiya Et</span>
        </span>
        <ExternalLink
          size={15}
          className="text-gray-400 transition-all duration-300 group-hover:text-[#29AEEE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </button>

      <ReservationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        profileName={profileName}
        whatsappNumber={whatsappNumber}
      />
    </>
  );
}
