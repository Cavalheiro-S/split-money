
import { Header } from "components/Header/header";
import { NavBar } from "components/NavBar/nav-bar";
import { Suspense } from "react";
import { Providers } from "../providers";
import Loading from "./loading";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Providers>
            <main
                className={`text-gray-800 relative grid grid-rows-[100px_1fr] grid-cols-[192px_1fr] min-h-screen overflow-hidden font-sans `}>
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