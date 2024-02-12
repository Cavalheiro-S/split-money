import { parseCookies } from "nookies";
import { createContext, useEffect, useState } from "react";

type Props = {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

export const AuthContext = createContext<Props>({} as Props)

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    useEffect(() => {
        const cookies = parseCookies()
        setIsAuthenticated(!!cookies['split.money.token'])
    }, [])

    const value = {
        isAuthenticated,
        setIsAuthenticated
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}