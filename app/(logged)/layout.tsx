"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import dynamic from "next/dynamic";

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
