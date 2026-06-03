"use client";

import { Trash2 } from "lucide-react";
import { deleteProfile } from "@/app/admin/actions";

type Props = {
  id: string;
  slug: string;
};

export default function DeleteProfileButton({ id, slug }: Props) {
  return (
    <form
      action={deleteProfile}
      onSubmit={(event) => {
        if (!confirm("Bu profili silmək istədiyinizə əminsiniz?")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition duration-150 ease-out hover:border-red-200 hover:text-red-600 active:scale-[0.98]"
        title="Delete profile"
      >
        <Trash2 size={18} />
      </button>
    </form>
  );
}
