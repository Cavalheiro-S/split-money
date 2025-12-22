import ClarityTag from "@/components/clarity";
import { NavigationLoader } from "@/components/navigation-loader";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth-context";
import { NavigationLoadingProvider } from "@/contexts/navigation-loading-context";
import { QueryProvider } from "@/providers/query-provider";
import type { Metadata } from "next";
import "../lib/amplify";
import { AmplifyProvider } from "../lib/amplify";
import "./globals.css";

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
          <AmplifyProvider>
            <NavigationLoadingProvider>
              <QueryProvider>
                <NavigationLoader />
                {children}
              </QueryProvider>
            </NavigationLoadingProvider>
          </AmplifyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
