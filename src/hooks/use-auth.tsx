import { signIn } from "@/services/auth"
import { useMutation } from "@tanstack/react-query"
import { setCookie } from "nookies"
import { toast } from "react-toastify"

export const useAuth = () => {
    const signInMutate = useMutation({
        mutationKey: ["auth"],
        mutationFn: ({ email, password }: { email: string, password: string }) => signIn(email, password),
        onSuccess: ({ data }) => {
            if (data) {
                setCookie(null, "split.money.token", data.access_token, {
                    maxAge: data.expiresIn,
                    path: "/"
                })
                toast.success("Login realizado com sucesso!")
            }
        },
        onError: (error) => toast.error("Email ou senha inválidos , " + error.message)
    })

    return { signInMutate }
}