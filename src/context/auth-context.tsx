import { parseCookies } from "nookies";
import { createContext, useCallback, useEffect, useState } from "react";

type Props = {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
    user: AccessTokenPayload | null
    setUser: React.Dispatch<React.SetStateAction<AccessTokenPayload | null>>
}

export const AuthContext = createContext<Props>({} as Props)

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState<AccessTokenPayload | null>(null)

    const initialize = useCallback(() => {
        const cookies = parseCookies()
        if (cookies["split.money.token"]) {
            setIsAuthenticated(true)
        }
    }, [])

    useEffect(() => {
        initialize();
      }, [initialize]);

    const value = {
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}