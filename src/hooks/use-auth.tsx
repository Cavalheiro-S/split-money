import { signIn } from "@/services/auth"
import { useMutation } from "@tanstack/react-query"
import { setCookie } from "nookies"
import { toast } from "react-toastify"
import { useUser } from "./use-user"
import { useContext } from "react"
import { AuthContext } from "@/context/auth-context"
import { jwtDecode } from "jwt-decode"

export const useAuth = () => {
    const { mutateGetUser } = useUser()
    const { setIsAuthenticated, setUser } = useContext(AuthContext)

    const signInMutate = useMutation({
        mutationKey: ["auth"],
        mutationFn: ({ email, password }: { email: string, password: string }) => signIn(email, password),
        onSuccess: async ({ data }, { email }) => {
            if (data) {
                const dataDecode = jwtDecode<AccessTokenPayload>(data.access_token)
                setCookie(null, "split.money.token", data.access_token, {
                    expires: new Date(dataDecode.exp * 1000),
                    path: "/"
                })
                setIsAuthenticated(true)
                setUser(dataDecode)
                toast.success("Login realizado com sucesso!")
                await mutateGetUser.mutateAsync(email)
            }
        },
        onError: (error) => toast.error("Email ou senha inválidos , " + error.message)
    })

    return { signInMutate }
}