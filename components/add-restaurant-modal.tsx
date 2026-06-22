'use client';

import { useState } from "react";
import { X, Plus, Save } from "lucide-react";

interface AddRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (restaurant: any) => void;
}

export default function AddRestaurantModal({ isOpen, onClose, onAdd }: AddRestaurantModalProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onAdd({
      id: Date.now().toString(),
      name: name.trim(),
      location: location.trim() || "Yer göstərilməyib",
      status,
      revenue: 0,
      orders: 0,
      rating: 0,
      avatar_url: null,
    });
    
    setName("");
    setLocation("");
    setStatus("active");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-black tracking-tight text-slate-900">Yeni Restoran</h3>
          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#29AEEE] hover:text-[#29AEEE] hover:bg-[#29AEEE]/5"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
              Restoran Adı
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Məsələn: Qarabağ Restoranı"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-[#29AEEE] focus:ring-4 focus:ring-[#29AEEE]/20"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
              Məkan
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Məsələn: Bakı, Azərbaycan"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-[#29AEEE] focus:ring-4 focus:ring-[#29AEEE]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
              Status
            </label>
            <div className="flex gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 border-green-200 bg-green-50 text-green-700">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={status === "active"}
                  onChange={() => setStatus("active")}
                  className="sr-only"
                />
                Aktiv
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-bold uppercase tracking-wide cursor-pointer transition-all duration-200 border-slate-200 bg-slate-50 text-slate-500">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={status === "inactive"}
                  onChange={() => setStatus("inactive")}
                  className="sr-only"
                />
                Deaktiv
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#29AEEE] px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-[#29AEEE]/20 transition-all duration-200 hover:bg-[#1a9ad4] hover:shadow-lg hover:shadow-[#29AEEE]/25 active:scale-[0.96]"
          >
            <Save size={16} /> Əlavə Et
          </button>
        </form>
      </div>
    </div>
  );
}