"use client";

import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  async function checkAuth() {
    try {
      const token = await AuthService.getToken();
      if (token) {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    }
  }
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="min-h-svh flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
