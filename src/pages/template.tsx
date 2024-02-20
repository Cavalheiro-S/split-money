import { AuthContext } from "@/context/auth-context"
import { useContext, useEffect } from "react"

export default function Template({ children }: { children: React.ReactNode }) {
    const { setIsAuthenticated } = useContext(AuthContext)
    useEffect(() => {
        const userId = localStorage.getItem('userId')
        console.log(userId);

        if (userId)
            setIsAuthenticated(true)
    }, [])
    return (
        <>
            {children}
        </>
    )
}