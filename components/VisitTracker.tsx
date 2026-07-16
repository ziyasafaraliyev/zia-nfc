"use client";

import { useEffect } from "react";

export default function VisitTracker() {
  useEffect(() => {
    // Bir session-da yalnız 1 dəfə say (Telegram-a dərhal yazmır — günlük raport 20:00-da)
    if (sessionStorage.getItem("visit-counted")) return;

    sessionStorage.setItem("visit-counted", "true");

    fetch("/api/visit", {
      method: "POST",
    }).catch(() => {});
  }, []);

  return null;
}
