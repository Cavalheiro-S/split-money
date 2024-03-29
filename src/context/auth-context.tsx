import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { parseCookies, setCookie, destroyCookie } from "nookies"
import { JWT_TOKEN_COOKIE } from "@/global.config";
import { useRouter } from "next/router";

type Props = {
    token: string | null;
    setToken: (token: string | null) => void
    user: AccessTokenPayload | null
    setUser: React.Dispatch<React.SetStateAction<AccessTokenPayload | null>>
}

export const AuthContext = createContext<Props>({} as Props)

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken_] = useState<string | null>(null)
    const [user, setUser] = useState<AccessTokenPayload | null>(null)
    const router = useRouter()

    const setToken = (newToken: string | null) => {
        setToken_(newToken)
    }
    const verifyCookieExists = useCallback(() => {
        const cookies = parseCookies()
        const cookieToken = cookies[JWT_TOKEN_COOKIE]
        if (!cookieToken) {
            setToken(null)
            if (!window.location.pathname.includes("session/login"))
                router.replace("/session/login")
        }
        else
            setToken(cookieToken)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    useEffect(() => {

        const intervalId = setInterval(verifyCookieExists, 1000)

        return () => clearInterval(intervalId)
    }, [])

    const contextValue = useMemo(
        () => ({
            token,
            setToken,
            user,
            setUser
        }),
        [token, user]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}