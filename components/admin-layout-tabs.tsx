"use client";

import React, { useState } from "react";
import { Plus, Users } from "lucide-react";

type Props = {
  createSection: React.ReactNode;
  listSection: React.ReactNode;
  profilesCount: number;
};

export default function AdminLayoutTabs({ createSection, listSection, profilesCount }: Props) {
  const [activeTab, setActiveTab] = useState<"create" | "list">("create");

  return (
    <div className="mt-6 flex flex-col gap-6">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("create")}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold border-b-2 transition-all duration-200 outline-none ${
            activeTab === "create"
              ? "border-[#29AEEE] text-[#29AEEE]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          <Plus size={16} />
          Yeni Profil Yarat
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold border-b-2 transition-all duration-200 outline-none ${
            activeTab === "list"
              ? "border-[#29AEEE] text-[#29AEEE]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          <Users size={16} />
          Profil Siyahısı ({profilesCount})
        </button>
      </div>

      {/* Tab Contents */}
      <div className="transition-all duration-300">
        {activeTab === "create" ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            {createSection}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            {listSection}
          </div>
        )}
      </div>
    </div>
  );
}
