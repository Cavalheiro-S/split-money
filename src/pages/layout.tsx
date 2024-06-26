import { Header } from "@/components/Header";
import { NavBar } from "@/components/NavBar/NavBar";
import { Providers } from "@/providers";
import { Rubik } from 'next/font/google';
import { Suspense } from "react";
import Loading from "./loading";

const rubik = Rubik({
    subsets: ['latin'],
    variable: '--font-rubik'
})

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Providers>
            <main
                className={`${rubik.variable} text-gray-800 relative grid grid-rows-[100px_1fr] grid-cols-[192px_1fr] min-h-screen overflow-x-hidden font-sans bg-background`}>
                <Suspense fallback={<Loading />}>
                    <Header />
                    <NavBar />
                    {children}
                </Suspense>
            </main>
        </Providers>
    )

}

export default RootLayout