export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-svh bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    );
}
