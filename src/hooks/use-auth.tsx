import { AuthContext } from "@/context/auth-context"
import { signIn } from "@/services/auth"
import { useMutation } from "@tanstack/react-query"
import { jwtDecode } from "jwt-decode"
import { setCookie } from "nookies"
import { useContext } from "react"
import { toast } from "react-toastify"

export const useAuth = () => {
    const { setIsAuthenticated, setUser } = useContext(AuthContext)

    const signInMutate = useMutation({
        mutationKey: ["auth"],
        mutationFn: ({ email, password }: { email: string, password: string }) => signIn(email, password),
        onSuccess: async ({ data }) => {
            if (data) {
                const dataDecode = jwtDecode<AccessTokenPayload>(data.access_token)
                setCookie(null, "split.money.token", data.access_token, {
                    expires: new Date(dataDecode.exp * 1000),
                    path: "/"
                })
                localStorage.setItem('userId', dataDecode.id)
                setIsAuthenticated(true)
                setUser(dataDecode)
                toast.success("Login realizado com sucesso!")
            }
        },
        onError: (error) => toast.error("Email ou senha inválidos , " + error.message)
    })

    return { signInMutate }
}