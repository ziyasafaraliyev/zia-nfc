"use client";

import { useEffect } from "react";

export default function VisitTracker() {
  useEffect(() => {
    // Bir session-da yalnız 1 dəfə göndərsin
    if (sessionStorage.getItem("visit-notified")) return;

    sessionStorage.setItem("visit-notified", "true");

    fetch("/api/visit", {
      method: "POST",
    }).catch(() => {});
  }, []);

  return null;
}
