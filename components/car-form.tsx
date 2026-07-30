"use client";

import { saveCarProfile } from "@/app/admin/actions";
import ServerActionForm from "@/components/server-action-form";
import type { CarProfile } from "@/lib/types";
import {
  Car,
  Check,
  Instagram,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Music2,
  Navigation,
  Phone,
  Save,
  Send,
  User,
  Upload,
} from "lucide-react";
import { useState } from "react";

type Props = {
  profile?: CarProfile;
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20";

export default function CarForm({ profile }: Props) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile?.avatar_url || null,
  );
  const [coverPreview, setCoverPreview] = useState<string | null>(
    profile?.cover_url || null,
  );

  return (
    <ServerActionForm action={saveCarProfile} className="space-y-6">
      {profile?.id && <input type="hidden" name="id" value={profile.id} />}
      {profile?.avatar_url && (
        <input
          type="hidden"
          name="existing_avatar_url"
          value={profile.avatar_url}
        />
      )}
      {profile?.cover_url && (
        <input
          type="hidden"
          name="existing_cover_url"
          value={profile.cover_url}
        />
      )}

      {/* Basic Car Info */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">
          Avto və Sürücü Məlumatları
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Sürücü Adı & Soyadı *
              <input
                name="driver_name"
                type="text"
                required
                defaultValue={profile?.driver_name || ""}
                placeholder="məs: Ziya Səfərəliyev"
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Avtomobil Modeli *
              <input
                name="car_name"
                type="text"
                required
                defaultValue={profile?.car_name || ""}
                placeholder="məs: Mercedes-Benz S-Class"
                className={inputClass}
              />
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Dövlət Nömrəsi (Nümayiş üçün) *
              <input
                name="plate"
                type="text"
                required
                defaultValue={profile?.plate || ""}
                placeholder="məs: 99-AA-001"
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Profil Keçidi (Slug / URL) *
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  /
                </span>
                <input
                  name="slug"
                  type="text"
                  required
                  defaultValue={profile?.slug || ""}
                  placeholder="99-aa-001"
                  className={`${inputClass} pl-8`}
                />
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">
          Şəkillər (Profil & Cover)
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Avatar Upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Profil Şəkli
            </label>
            <div className="flex items-center gap-3">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="size-16 rounded-2xl object-cover ring-2 ring-sky-500/20"
                />
              ) : (
                <div className="grid size-16 place-items-center rounded-2xl bg-slate-100 text-slate-400 border border-slate-200">
                  <User size={24} />
                </div>
              )}
              <input
                name="avatar"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setAvatarPreview(URL.createObjectURL(file));
                }}
                className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-sky-50 file:px-3 file:py-2 file:text-xs file:font-bold file:text-sky-700 hover:file:bg-sky-100"
              />
            </div>
          </div>

          {/* Cover Upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Cover Şəkli (Avto Fona)
            </label>
            <div className="flex items-center gap-3">
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Cover Preview"
                  className="h-16 w-24 rounded-2xl object-cover ring-2 ring-sky-500/20"
                />
              ) : (
                <div className="grid h-16 w-24 place-items-center rounded-2xl bg-slate-100 text-slate-400 border border-slate-200">
                  <Car size={24} />
                </div>
              )}
              <input
                name="cover"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setCoverPreview(URL.createObjectURL(file));
                }}
                className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-sky-50 file:px-3 file:py-2 file:text-xs file:font-bold file:text-sky-700 hover:file:bg-sky-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Primary Contact Buttons */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">
          Əlaqə Düymələri (Zəng et & WhatsApp)
        </h3>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Telefon 1 (Sürücü Zəng)
              <input
                name="phone"
                type="text"
                defaultValue={profile?.phone || ""}
                placeholder="+994 50 123 45 67"
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Telefon 2 (Təcili Əlaqə)
              <input
                name="phone2"
                type="text"
                defaultValue={profile?.phone2 || ""}
                placeholder="+994 70 987 65 43"
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              WhatsApp Nömrəsi
              <input
                name="whatsapp"
                type="text"
                defaultValue={profile?.whatsapp || ""}
                placeholder="994501234567"
                className={inputClass}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Social Networks */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">
          Sosial Şəbəkələr & Naviqasiya
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Instagram Linki
              <input
                name="instagram"
                type="text"
                defaultValue={profile?.instagram || ""}
                placeholder="https://instagram.com/..."
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              TikTok Linki
              <input
                name="tiktok"
                type="text"
                defaultValue={profile?.tiktok || ""}
                placeholder="https://tiktok.com/@..."
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Telegram Linki
              <input
                name="telegram"
                type="text"
                defaultValue={profile?.telegram || ""}
                placeholder="https://t.me/..."
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Waze / Lokasiya Linki
              <input
                name="waze"
                type="text"
                defaultValue={profile?.waze || ""}
                placeholder="https://waze.com/..."
                className={inputClass}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Status Toggle */}
      <div className="pt-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="enabled"
            defaultChecked={profile ? profile.enabled : true}
            className="size-5 rounded-lg border-slate-300 text-sky-500 focus:ring-sky-500"
          />
          <span className="text-sm font-bold text-slate-800">
            Profil aktiv olsun (Görünür)
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-6 py-4 font-black uppercase tracking-wider text-white shadow-lg shadow-sky-500/25 transition duration-200 hover:bg-sky-400 active:scale-[0.98]"
        >
          <Save size={18} /> Yadda Saxla
        </button>
      </div>
    </ServerActionForm>
  );
}
