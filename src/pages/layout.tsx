import { Header } from "@/components/Header";
import { Providers } from "@/providers";
import { QueryClient } from "@tanstack/react-query";
import { Rubik } from 'next/font/google';
import { useState } from "react";

const rubik = Rubik({
    subsets: ['latin'],
    variable: '--font-rubik'
})


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Providers>
            <main
                className={`${rubik.variable} text-gray-800 relative grid grid-rows-[100px_1fr] grid-cols-[192px_1fr] min-h-screen overflow-x-hidden font-sans bg-background`}>
                <Header />
                {/* {data["split.money.token"] && <NavBar />} */}
                {children}
            </main>
        </Providers>
    )

}