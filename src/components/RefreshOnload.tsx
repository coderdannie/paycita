"use client";

import { useEffect } from "react";
import { getQueryClient } from "@/lib/queryClient";

export function RefreshOnLoad() {
  useEffect(() => {
    const queryClient = getQueryClient();
    queryClient.invalidateQueries();
  }, []);

  return null;
}
