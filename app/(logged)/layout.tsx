"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import dynamic from "next/dynamic";
import { Loader } from "lucide-react";

const SidebarItems = dynamic(
  () => import("@/components/sidebar/items").then((mod) => mod.SidebarItems),
  {
    loading: () => (
      <div className="w-64 h-screen bg-gray-100 animate-pulse border-r" />
    ),
    ssr: false,
  }
);

export default function LoggedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verificando sessão...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <SidebarItems />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <main className="flex flex-col gap-4 p-4 bg-gray-100">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
