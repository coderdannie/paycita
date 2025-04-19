"use client";

import { initAudio } from "@/src/utils/audio";
import { useEffect } from "react";

export default function ChatNotification() {
  useEffect(() => {
    const handleInteraction = () => {
      initAudio();
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  return null;
}
