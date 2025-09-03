'use client';

import { SidebarItems } from "@/components/sidebar/items";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoggedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { loading, isAuthenticated } = useAuthGuard();

    if (loading) {
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
        return null; // O hook redirecionará automaticamente
    }

    return (
        <SidebarProvider>
            <SidebarItems />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                </header>
                <main className="flex flex-col gap-4 p-4 bg-gray-100">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
