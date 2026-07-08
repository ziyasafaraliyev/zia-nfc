"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteProfile, deleteRestaurant } from "@/app/admin/actions";
import { handleServerActionRejection } from "@/lib/server-action-client";

type Props = {
  id: string;
  slug: string;
  actionName?: "deleteProfile" | "deleteRestaurant";
};

export default function DeleteProfileButton({
  id,
  slug,
  actionName = "deleteProfile",
}: Props) {
  const [pending, setPending] = useState(false);
  const message =
    actionName === "deleteRestaurant"
      ? "Bu restoranı silmək istədiyinizə əminsiniz?"
      : "Bu profili silmək istədiyinizə əminsiniz?";
  const action = actionName === "deleteRestaurant" ? deleteRestaurant : deleteProfile;
  const title = actionName === "deleteRestaurant" ? "Restoranı sil" : "Profili sil";

  async function handleDelete() {
    if (!window.confirm(message)) {
      return;
    }

    setPending(true);

    const formData = new FormData();
    formData.set("id", id);
    formData.set("slug", slug);

    try {
      await action(formData);
    } catch (error) {
      if (handleServerActionRejection(error)) {
        return;
      }

      console.error(error);
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleDelete}
      className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition duration-150 ease-out hover:border-red-200 hover:text-red-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      title={title}
    >
      <Trash2 size={18} />
    </button>
  );
}