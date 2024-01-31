import { signIn } from "@/services/auth"
import { useMutation, useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { toast } from "react-toastify"

export const useAuth = () => {
    const signInMutate = useMutation({
        mutationKey: ["auth"],
        mutationFn: ({ email, password }: { email: string, password: string }) => signIn(email, password),
        onSuccess: ({ data }) => {
            if (data) {
                Cookies.set("split.money.token", data.access_token, { expires: new Date(data.expiresIn * 1000) })
                Cookies.set("split.money.expiresAt", new Date(data.expiresIn * 1000).toISOString())
                toast.success("Login realizado com sucesso!")
            }
        },
        onError: (error) => toast.error("Email ou senha inválidos , " + error.message)
    })

    return { signInMutate }
}