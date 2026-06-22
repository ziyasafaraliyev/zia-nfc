"use client";

import { Trash2 } from "lucide-react";

type Props = {
  id: string;
  slug: string;
  actionName?: "deleteProfile" | "deleteRestaurant";
};

export default function DeleteProfileButton({ 
  id, 
  slug, 
  actionName = "deleteProfile" 
}: Props) {
  const message = actionName === "deleteRestaurant" 
    ? "Bu restoranı silmək istədiyinizə əminsiniz?" 
    : "Bu profili silmək istədiyinizə əminsiniz?";

  return (
    <form
      action={async (formData) => {
        const { [actionName]: action } = await import("@/app/admin/actions");
        await action(formData);
      }}
      onSubmit={(event) => {
        if (!confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition duration-150 ease-out hover:border-red-200 hover:text-red-600 active:scale-[0.98]"
        title={actionName === "deleteRestaurant" ? "Restoranı sil" : "Profili sil"}
      >
        <Trash2 size={18} />
      </button>
    </form>
  );
}
