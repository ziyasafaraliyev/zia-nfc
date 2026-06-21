"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, User, Send, X } from "lucide-react";

// Azerbaijan timezone helper
function getBakuDate() {
  return new Date().toLocaleString("az-AZ", { timeZone: "Asia/Baku" });
}

function getBakuDateISO() {
  const bakuDate = new Date(getBakuDate());
  const year = bakuDate.getFullYear();
  const month = String(bakuDate.getMonth() + 1).padStart(2, "0");
  const day = String(bakuDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Format date to Azerbaijani format: "21 İyun"
function formatDateAz(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const bakuDate = date.toLocaleString("az-AZ", { timeZone: "Asia/Baku" });
  const formatted = new Date(bakuDate);

  const dayNum = formatted.getDate();
  const monthNamesAz = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
    "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
  ];
  const monthAz = monthNamesAz[formatted.getMonth()];

  return `${dayNum} ${monthAz}`;
}

// Format time to 24h format: "14:30" (no AM/PM)
function formatTime24(timeStr: string): string {
  if (!timeStr) return "";
  // Ensure HH:MM format without AM/PM
  const [hours, minutes] = timeStr.split(":").map(Number);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function buildTimeOptions(): string[] {
  const options: string[] = [];

  for (let hour = 8; hour <= 20; hour += 1) {
    for (const minute of [0, 30]) {
      if (hour === 20 && minute > 0) {
        continue;
      }
      options.push(
        `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      );
    }
  }

  return options;
}

const TIME_OPTIONS = buildTimeOptions();

// Get tomorrow's date in Baku timezone
function getTomorrowDateISO(): string {
  const bakuDate = new Date(getBakuDate());
  bakuDate.setDate(bakuDate.getDate() + 1);
  const year = bakuDate.getFullYear();
  const month = String(bakuDate.getMonth() + 1).padStart(2, "0");
  const day = String(bakuDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface ReservationModalProps {
  profileName: string;
  whatsappNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReservationModal({
  profileName,
  whatsappNumber,
  isOpen,
  onClose,
}: ReservationModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const minDate = getTomorrowDateISO();

  // Initialize with current date when modal opens
  useEffect(() => {
    if (isOpen) {
      setDate(minDate);
      // Default to the next available 30-minute slot in 24-hour format.
      const now = new Date(getBakuDate());
      const nextSlot = new Date(now.getTime());
      nextSlot.setSeconds(0, 0);

      const minutes = nextSlot.getMinutes();
      if (minutes === 0) {
        nextSlot.setMinutes(30);
      } else if (minutes <= 30) {
        nextSlot.setMinutes(30);
      } else {
        nextSlot.setHours(nextSlot.getHours() + 1, 0, 0, 0);
      }

      const nextTime = `${String(nextSlot.getHours()).padStart(2, "0")}:${String(
        nextSlot.getMinutes(),
      ).padStart(2, "0")}`;

      setTime(TIME_OPTIONS.includes(nextTime) ? nextTime : "08:00");
    }
  }, [isOpen, minDate]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!firstName || !lastName || !date || !time) {
      alert("Zəhmət olmasa bütün sahələri doldurun");
      return;
    }

    // Format WhatsApp message with Azerbaijani date format
    const formattedDate = formatDateAz(date);
    const formattedTime = formatTime24(time);
    const noteLine = note.trim() ? `\nQeyd: ${note.trim()}` : "";

    const message = `Salam ${profileName}.

Yeni rezervasiya müraciəti:

Ad: ${firstName}
Soyad: ${lastName}
Tarix: ${formattedDate}
Saat: ${formattedTime}${noteLine}`;

    // Clean WhatsApp number (remove non-digits)
    const cleanNumber = whatsappNumber.replace(/[^\d]/g, "");

    // Create WhatsApp URL with pre-filled message
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    // Reset form and close
    setFirstName("");
    setLastName("");
    setDate(minDate);
    setTime("");
    setNote("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">Rezervasiya Et</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* First Name */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide">
              Ad
            </label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Adınız"
                className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-[#29AEEE] focus:ring-4 focus:ring-[#29AEEE]/20"
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide">
              Soyad
            </label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Soyadınız"
                className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-[#29AEEE] focus:ring-4 focus:ring-[#29AEEE]/20"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide">
              Tarix (Ay / Gün)
            </label>
            <div className="relative">
              <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
                className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-[#29AEEE] focus:ring-4 focus:ring-[#29AEEE]/20"
              />
              {date && (
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#29AEEE]">
                  {formatDateAz(date)}
                </span>
              )}
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide">
              Saat (24 saatlik)
            </label>
            <div className="relative">
              <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-11 pr-20 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-[#29AEEE] focus:ring-4 focus:ring-[#29AEEE]/20"
              >
                <option value="">Saat seçin</option>
                {TIME_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {time && (
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#29AEEE]">
                  {formatTime24(time)}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide">
              Qeyd
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Əlavə qeyd yaza bilərsiniz"
              rows={3}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-[#29AEEE] focus:ring-4 focus:ring-[#29AEEE]/20"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-[#20bd5a] hover:shadow-lg active:scale-[0.96]"
        >
          <Send size={16} />
          WhatsApp ilə göndər
        </button>
      </div>
    </div>
  );
}
