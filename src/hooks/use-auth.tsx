import { AuthContext } from "@/context/auth-context"
import { JWT_TOKEN_COOKIE } from "@/global.config"
import { signIn } from "@/services/auth"
import { useMutation } from "@tanstack/react-query"
import { jwtDecode } from "jwt-decode"
import { setCookie } from "nookies"
import { useContext } from "react"
import { toast } from "react-toastify"

export const useAuth = () => {
    const { setToken, setUser } = useContext(AuthContext)

    const signInMutate = useMutation({
        mutationKey: ["auth"],
        mutationFn: ({ email, password }: RequestLogin) => signIn(email, password),
        onSuccess: async ({ data }) => {
            if (data) {
                const dataDecode = jwtDecode<AccessTokenPayload>(data.access_token)
                setCookie(null, JWT_TOKEN_COOKIE, data.access_token, {
                    expires: new Date(dataDecode.exp * 1000),
                    path: "/"
                })
                localStorage.setItem('userId', dataDecode.id)
                setToken(data.access_token)
                setUser(dataDecode)
                toast.success("Login realizado com sucesso!")
            }
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    return { signInMutate }
}