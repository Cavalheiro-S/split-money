import { SidebarItems } from "@/components/sidebar/items";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function LoggedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    

    return (
        <SidebarProvider>
            <SidebarItems />
            <main className="min-h-screen w-full">
                <SidebarTrigger className="m-2" />
                {children}
            </main>
        </SidebarProvider>
    );
}
