"use client";

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { deleteProfile, deleteRestaurant } from "@/app/admin/actions";

type Props = {
  id: string;
  slug: string;
  actionName?: "deleteProfile" | "deleteRestaurant";
};

function SubmitButton({ title }: { title: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition duration-150 ease-out hover:border-red-200 hover:text-red-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      title={title}
    >
      <Trash2 size={18} />
    </button>
  );
}

export default function DeleteProfileButton({ 
  id, 
  slug, 
  actionName = "deleteProfile" 
}: Props) {
  const message = actionName === "deleteRestaurant" 
    ? "Bu restoranı silmək istədiyinizə əminsiniz?" 
    : "Bu profili silmək istədiyinizə əminsiniz?";
  const action = actionName === "deleteRestaurant" ? deleteRestaurant : deleteProfile;
  const title = actionName === "deleteRestaurant" ? "Restoranı sil" : "Profili sil";

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="slug" value={slug} />
      <SubmitButton title={title} />
    </form>
  );
}
