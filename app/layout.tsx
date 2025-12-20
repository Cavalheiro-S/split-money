import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ClarityTag from "@/components/clarity";
import { NavigationLoader } from "@/components/navigation-loader";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/contexts/auth-context";
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
        <Toaster />
        <AuthProvider>
          <NavigationLoadingProvider>
            <QueryProvider>
              <NavigationLoader />
              {children}
            </QueryProvider>
          </NavigationLoadingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
