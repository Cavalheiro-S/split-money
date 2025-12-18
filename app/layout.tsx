import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ClarityTag from "@/components/clarity";
import { SessionInitializer } from "@/components/session-initializer";
import { NavigationLoader } from "@/components/navigation-loader";
import { QueryProvider } from "@/providers/query-provider";
import { UserProvider } from "@/contexts/user-context";
import { NavigationLoadingProvider } from "@/contexts/navigation-loading-context";

export const metadata: Metadata = {
  title: "Split Money",
  description: "Gerencie suas despesas compartilhadas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <ClarityTag />
      </head>
      <body className="antialiased">
        <UserProvider>
          <NavigationLoadingProvider>
            <QueryProvider>
              <SessionInitializer />
              <NavigationLoader />
              {children}
              <Toaster />
            </QueryProvider>
          </NavigationLoadingProvider>
        </UserProvider>
      </body>
    </html>
  );
}
