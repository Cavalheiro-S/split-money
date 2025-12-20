"use client";

import dynamic from "next/dynamic";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

const SidebarItems = dynamic(
  () => import("@/components/sidebar/items").then((mod) => mod.SidebarItems),
  {
    loading: () => (
      <div className="w-64 h-screen bg-gray-100 animate-pulse border-r" />
    ),
    ssr: false, // Sidebar navigation is client-side mostly implies user interaction
  }
);

export default function LoggedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
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
