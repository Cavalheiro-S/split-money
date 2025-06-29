import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/contexts/user-context";
import ClarityProvider from '@/components/clarity';
const poppinsSans = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Split Money",
  description: "Aplication to control your transactions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  const isProduction = process.env.NODE_ENV === "production";
  
  return (
    <html lang="pt-br">
      <body
        className={`${poppinsSans.variable} antialiased`}
      >
        <UserProvider>
          {children}
        </UserProvider>
        <Toaster />
        {isProduction && projectId && <ClarityProvider projectId={projectId} />}
      </body>
    </html>
  );
}

