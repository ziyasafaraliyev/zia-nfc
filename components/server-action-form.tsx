"use client";

import { handleServerActionRejection } from "@/lib/server-action-client";

type ServerAction = (formData: FormData) => Promise<void>;

type Props = {
  action: ServerAction;
  children: React.ReactNode;
  className?: string;
  confirmMessage?: string;
};

export default function ServerActionForm({
  action,
  children,
  className,
  confirmMessage,
}: Props) {
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (confirmMessage && !window.confirm(confirmMessage)) {
      return;
    }

    try {
      await action(new FormData(event.currentTarget));
    } catch (error) {
      if (handleServerActionRejection(error)) {
        return;
      }

      console.error(error);
    }
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
    </form>
  );
}