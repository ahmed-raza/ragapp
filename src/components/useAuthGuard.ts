// components/useAuthGuard.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    api.get("/ping").then(() => {
      // User is authenticated, do nothing
    }).catch(() => {
      // User is not authenticated, redirect to login
      localStorage.removeItem("token");
      router.replace("/login");
    });
  }, []);
}
