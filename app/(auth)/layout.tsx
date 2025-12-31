"use client";

import { useAuth } from "@/contexts/auth-context";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { isInitializing, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isInitializing, isAuthenticated, router]);

  if (isInitializing) {
    return (
      <div className="min-h-svh flex items-center justify-center p-4 md:p-8">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-svh flex items-center justify-center p-4 md:p-8">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
