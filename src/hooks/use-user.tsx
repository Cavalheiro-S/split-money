import { api } from "@/data/axios"
import { useMutation } from "@tanstack/react-query"

export const useUser = () => {

    const mutateGetUser = useMutation({
        mutationKey: ["user"],
        mutationFn: (email: string) => api.post<ApiBase<User>>("/user/getByEmail", { email: email }),
        onSuccess: ({ data }) => {
            data.data && localStorage.setItem("userId", JSON.stringify(data.data.id))
        }
    })

    return { mutateGetUser }
}