import { Header } from "@/components/Header"
import { NavBar } from "@/components/NavBar/NavBar"
import { NextComponentType } from "next"
import { ToastContainer } from "react-toastify"
import { useMemo } from "react"
import { parseCookies } from "nookies"

interface Props {
    Component: NextComponentType,
    pageProps: any
}

export default function Page({ Component, pageProps }: Props) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const cookies = parseCookies()
    
    const isAuthenticated = useMemo(() => !!cookies["split.money.token"], [cookies])
    return (
        <>
            <Header />
            <NavBar isAuthenticated={isAuthenticated} />
            <Component {...pageProps} />
            <ToastContainer limit={1} />
        </>
    )
}